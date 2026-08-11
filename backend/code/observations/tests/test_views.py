from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

from observations.models import GeoObservation, ObservationSubdomain

User = get_user_model()


class ObservationApiTests(APITestCase):
    def setUp(self):
        # Create test user
        self.user = User.objects.create_user(
            username="tester", password="Password123!"
        )
        self.client.force_authenticate(user=self.user)

        # Create test subdomains
        self.subdomain_water = ObservationSubdomain.objects.create(
            name="Groundwater Quality", domain="WATER"
        )
        self.subdomain_soil = ObservationSubdomain.objects.create(
            name="Soil Erosion", domain="SOIL"
        )

        # Create test observation
        self.observation = GeoObservation.objects.create(
            title="Baseline Water Test",
            subdomain=self.subdomain_water,
            status="VERIFIED",
        )

    def test_list_subdomains_filtered_by_domain(self):
        """Ensure domain query parameter correctly filters subdomains."""
        url = reverse("subdomain-list") + "?domain=WATER"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get("results", response.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["name"], "Groundwater Quality")

    def test_list_observations_filtered_by_subdomain(self):
        """Ensure observation query parameter filters observations by subdomain ID."""
        url = reverse("geo-observation-list") + f"?subdomain={self.subdomain_water.id}"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get("results", response.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["title"], "Baseline Water Test")

    def test_unauthenticated_request_denied(self):
        """Ensure unauthenticated users receive a 401 Unauthorized response."""
        self.client.logout()
        url = reverse("geo-observation-list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)