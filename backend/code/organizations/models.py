import uuid
from django.db import models


class OrgTypeChoices(models.TextChoices):
    NGO = "NGO", "Non-Governmental Organization"
    GOVERNMENT = "GOVERNMENT", "Government Agency"
    RESEARCH = "RESEARCH", "Research & Academic Institution"
    FOUNDATION = "FOUNDATION", "Environmental Foundation"
    PRIVATE = "PRIVATE", "Private Enterprise"


class Organization(models.Model):
    """
    Represents partner organizations, research entities, and operational institutions.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True, db_index=True)
    org_type = models.CharField(
        max_length=20,
        choices=OrgTypeChoices.choices,
        default=OrgTypeChoices.NGO,
        db_index=True,
    )
    description = models.TextField(blank=True, default="")
    website = models.URLField(blank=True, default="")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.code})"