from django.contrib.auth import get_user_model
from django.contrib.gis.geos import MultiPolygon, Point, Polygon
from django.test import TestCase

from locations.models import AdministrativeUnit, AdminLevelChoices
from observations.models import GeoObservation

User = get_user_model()


class SpatialSignalTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="signal_tester", password="Password123!"
        )

        # Outer Governorate polygon covering coordinates (0,0) to (10,10)
        gov_poly = Polygon(((0, 0), (0, 10), (10, 10), (10, 0), (0, 0)))
        self.governorate = AdministrativeUnit.objects.create(
            name="Governorate A",
            code="GOV-A",
            level=AdminLevelChoices.GOVERNORATE,
            geometry=MultiPolygon(gov_poly),
        )

        # Inner Subdistrict polygon covering coordinates (1,1) to (4,4)
        sub_poly = Polygon(((1, 1), (1, 4), (4, 4), (4, 1), (1, 1)))
        self.subdistrict = AdministrativeUnit.objects.create(
            name="Subdistrict A1",
            code="SUB-A1",
            level=AdminLevelChoices.SUBDISTRICT,
            parent=self.governorate,
            geometry=MultiPolygon(sub_poly),
        )

    def test_auto_assign_subdistrict_on_save(self):
        """Ensure point at (2,2) automatically assigns the Subdistrict (Level 3)."""
        point_inside = Point(2, 2)
        obs = GeoObservation.objects.create(
            title="Water Quality Sample",
            description="Sample collected at stream site",
            location=point_inside,
            created_by=self.user,
        )

        obs.refresh_from_db()
        self.assertIsNotNone(obs.admin_unit)
        self.assertEqual(obs.admin_unit, self.subdistrict)

    def test_manual_admin_unit_preserved(self):
        """Ensure explicit admin_unit assignment is not overridden by signal."""
        point_inside = Point(2, 2)
        obs = GeoObservation.objects.create(
            title="Manual Assignment",
            location=point_inside,
            admin_unit=self.governorate,
            created_by=self.user,
        )

        obs.refresh_from_db()
        self.assertEqual(obs.admin_unit, self.governorate)