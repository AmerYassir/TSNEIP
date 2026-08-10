from django.contrib.auth import get_user_model
from django.contrib.gis.geos import MultiPolygon, Polygon
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from locations.models import AdministrativeUnit, AdminLevelChoices

User = get_user_model()


class AdministrativeUnitApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="loc_tester", password="Password123!"
        )
        self.client.force_authenticate(user=self.user)

        # Sample GeoDjango MultiPolygon spatial geometry
        poly = Polygon(((0, 0), (0, 10), (10, 10), (10, 0), (0, 0)))
        self.geom = MultiPolygon(poly)

        self.gov = AdministrativeUnit.objects.create(
            name="Governorate A",
            code="GOV-A",
            level=AdminLevelChoices.GOVERNORATE,
            geometry=self.geom
        )
        self.district = AdministrativeUnit.objects.create(
            name="District B",
            code="DIST-B",
            level=AdminLevelChoices.DISTRICT,
            parent=self.gov,
            geometry=self.geom
        )

    def test_list_units_filtered_by_level(self):
        """Ensure filtering by administrative level works correctly."""
        url = reverse("administrative-unit-list") + "?level=1"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get("results", response.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["name"], "Governorate A")

    def test_list_units_filtered_by_parent(self):
        """Ensure filtering by parent ID returns child units."""
        url = reverse("administrative-unit-list") + f"?parent={self.gov.id}"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get("results", response.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["name"], "District B")