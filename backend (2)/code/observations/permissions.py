from rest_framework import permissions


class UserRole:
    PUBLIC = "PUBLIC"
    FIELD_AGENT = "FIELD_AGENT"
    REVIEWER = "REVIEWER"
    ORG_ADMIN = "ORG_ADMIN"
    SUPER_ADMIN = "SUPER_ADMIN"


def get_user_role(user) -> str:
    """Helper to resolve role from user instance or superuser flag."""
    if not user or user.is_anonymous:
        return UserRole.PUBLIC
    if user.is_superuser:
        return UserRole.SUPER_ADMIN
    return getattr(user, "role", UserRole.PUBLIC)


class CanAccessObservationData(permissions.BasePermission):
    """
    Main permission class for GeoObservation endpoints:
    - Guests/Public: Read APPROVED items only.
    - Field Agents: Read APPROVED + own items. Create observations. Edit/Delete ONLY own DRAFTs/REJECTED.
    - Reviewers: Read APPROVED + review queue (SUBMITTED / UNDER_REVIEW). NO raw data edits.
    - Org/Super Admin: Full READ visibility across all statuses. NO raw data edits.
    """

    def has_permission(self, request, view):
        role = get_user_role(request.user)

        # 1. Read operations (GET, HEAD, OPTIONS) allowed for all roles
        if request.method in permissions.SAFE_METHODS:
            return True

        # 2. Creating observations (POST) is strictly restricted to Field Agents
        if request.method == "POST":
            return role in [UserRole.FIELD_AGENT, UserRole.SUPER_ADMIN]

        # 3. Mutating existing records (PUT, PATCH, DELETE) checked at object level
        return True

    def has_object_permission(self, request, view, obj):
        role = get_user_role(request.user)
        user = request.user

        # --- READ OPERATIONS (GET, HEAD, OPTIONS) ---
        if request.method in permissions.SAFE_METHODS:
            if role in [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN]:
                return True
            if role == UserRole.REVIEWER:
                return obj.status in ["APPROVED", "SUBMITTED", "UNDER_REVIEW"]
            if role == UserRole.FIELD_AGENT:
                return obj.status == "APPROVED" or obj.created_by == user
            # Public / Regular Users
            return obj.status == "APPROVED"

        # --- WRITE OPERATIONS (PUT, PATCH, DELETE) ---
        # Rule: Admins and Reviewers CANNOT modify raw observation measurements or fields
        if role in [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN, UserRole.REVIEWER]:
            return False

        # Rule: Only original Field Agent owner can edit, and ONLY in DRAFT or REJECTED status
        if role == UserRole.FIELD_AGENT:
            is_owner = obj.created_by == user
            is_editable_status = obj.status in ["DRAFT", "REJECTED"]
            return is_owner and is_editable_status

        return False


class CanExecuteReviewAction(permissions.BasePermission):
    """
    Object-level permission for review state-transition actions (@action):
    - claim, approve, reject
    Restricted strictly to assigned Reviewers on SUBMITTED or UNDER_REVIEW records.
    """

    def has_permission(self, request, view):
        role = get_user_role(request.user)
        return role in [UserRole.REVIEWER, UserRole.SUPER_ADMIN]

    def has_object_permission(self, request, view, obj):
        role = get_user_role(request.user)
        if role not in [UserRole.REVIEWER, UserRole.SUPER_ADMIN]:
            return False

        # Reviewers can only operate on items needing review
        return obj.status in ["SUBMITTED", "UNDER_REVIEW"]


class CanManageContentAndReports(permissions.BasePermission):
    """
    Permission class for News/Blog articles and internal Organization Reports:
    - SAFE_METHODS (GET): Public / Authenticated Users can read published content.
    - WRITE METHODS (POST, PUT, PATCH, DELETE): Restricted to Org Admins and Super Admins.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        role = get_user_role(request.user)
        return role in [UserRole.ORG_ADMIN, UserRole.SUPER_ADMIN]

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        role = get_user_role(request.user)
        if role == UserRole.SUPER_ADMIN:
            return True

        # Org Admins can manage content belonging to their specific organization
        if role == UserRole.ORG_ADMIN:
            user_org = getattr(request.user, "organization", None)
            obj_org = getattr(obj, "organization", None)
            return user_org is not None and user_org == obj_org

        return False