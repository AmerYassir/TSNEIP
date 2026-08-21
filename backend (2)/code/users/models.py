import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class UserRoleChoices(models.TextChoices):
    ADMIN = "ADMIN", _("System Administrator")
    MANAGER = "MANAGER", _("Organization Manager")
    COLLECTOR = "COLLECTOR", _("Field Data Collector")
    VIEWER = "VIEWER", _("Viewer / Analyst")


class User(AbstractUser):
    """
    Custom user model supporting multi-tenant organization membership
    and role-based access control.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(_("Email Address"), unique=True, db_index=True)
    organization = models.ForeignKey(
        "organizations.Organization",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="members",
        verbose_name=_("Organization"),
    )
    role = models.CharField(
        _("Role"),
        max_length=20,
        choices=UserRoleChoices.choices,
        default=UserRoleChoices.VIEWER,
        db_index=True,
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        ordering = ["email"]
        verbose_name = _("User")
        verbose_name_plural = _("Users")

    def __str__(self):
        return f"{self.email} ({self.get_role_display()})"