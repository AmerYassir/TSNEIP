# common/mixins.py
from users.role_matrix import ROLE_FIELD_PERMISSIONS

class RoleFieldPermissionsMixin:
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        request = self.context.get("request")
        view = self.context.get("view")
        if not request or not view:
            return

        role = getattr(request.user, "role", "PUBLIC")
        model_name = self.Meta.model.__name__
        action = getattr(view, "action", "default")

        # Fetch rules: ROLE -> MODEL -> ACTION
        rules = (
            ROLE_FIELD_PERMISSIONS
            .get(role, {})
            .get(model_name, {})
            .get(action, {})
        )

        # 1. Modify read_only flags
        for field_name in rules.get("read_only", []):
            if field_name in self.fields:
                self.fields[field_name].read_only = True

        # 2. Modify required flags
        for field_name in rules.get("required", []):
            if field_name in self.fields:
                self.fields[field_name].required = True

        # 3. Limit choices dropdowns
        for field_name, choice_list in rules.get("choices", {}).items():
            if field_name in self.fields and hasattr(self.fields[field_name], "choices"):
                self.fields[field_name].choices = choice_list