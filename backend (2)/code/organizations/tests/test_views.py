from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from organizations.models import Organization, OrgTypeChoices

User = get_user_model()


class OrganizationApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="org_tester", password="Password123!"
        )
        self.client.force_authenticate(user=self.user)

        self.org_foundation = Organization.objects.create(
            name="AlTatweer Foundation",
            code="ALTATWEER",
            org_type=OrgTypeChoices.FOUNDATION,
        )
        self.org_research = Organization.objects.create(
            name="Eco Research Center",
            code="ECO-RES",
            org_type=OrgTypeChoices.RESEARCH,
        )

    def test_list_organizations(self):
        """Ensure authenticated users can list all organizations."""
        url = reverse("organization-list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get("results", response.data)
        self.assertEqual(len(results), 2)

    def test_filter_by_org_type(self):
        """Ensure org_type query parameter filters organizations."""
        url = reverse("organization-list") + "?org_type=FOUNDATION"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get("results", response.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["code"], "ALTATWEER")

    def test_create_organization(self):
        """Ensure new organizations can be created via POST."""
        url = reverse("organization-list")
        payload = {
            "name": "Global Water Watch",
            "code": "GWW",
            "org_type": "NGO",
            "website": "https://example.org",
        }
        response = self.client.post(url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Organization.objects.count(), 3)

    def test_unauthenticated_access_denied(self):
        """Ensure unauthenticated requests are blocked."""
        self.client.logout()
        url = reverse("organization-list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)