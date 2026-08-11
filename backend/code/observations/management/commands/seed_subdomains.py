# observations/management/commands/seed_subdomains.py

import logging
from django.core.management.base import BaseCommand
from observations.models import DomainChoices, ObservationSubdomain

# Fetch the logger configured in settings.py
logger = logging.getLogger("monitoring")


class Command(BaseCommand):
    help = "Seeds initial ObservationSubdomains and default metric templates."

    def handle(self, *args, **options):
        logger.info("Starting subdomain database seed process...")

        subdomains_data = [
            # WATER RESOURCES
            {
                "domain": DomainChoices.WATER,
                "name": "Surface Water Quality",
                "sdg_alignment": "SDG 6.3.2",
                "metric_template": [
                    {"code": "pH", "label": "pH Level", "unit": "pH", "type": "number", "required": True},
                    {"code": "turbidity", "label": "Turbidity", "unit": "NTU", "type": "number", "required": False},
                    {"code": "dissolved_oxygen", "label": "Dissolved Oxygen", "unit": "mg/L", "type": "number", "required": False},
                    {"code": "nitrate", "label": "Nitrate Content", "unit": "mg/L", "type": "number", "required": False},
                ],
            },
            {
                "domain": DomainChoices.WATER,
                "name": "Groundwater & Aquifers",
                "sdg_alignment": "SDG 6.3.2",
                "metric_template": [
                    {"code": "water_depth", "label": "Water Table Depth", "unit": "m", "type": "number", "required": True},
                    {"code": "salinity_ec", "label": "Electrical Conductivity", "unit": "µS/cm", "type": "number", "required": False},
                    {"code": "pH", "label": "pH Level", "unit": "pH", "type": "number", "required": True},
                ],
            },
            # AIR & CLIMATE
            {
                "domain": DomainChoices.AIR,
                "name": "Ambient Air Quality",
                "sdg_alignment": "SDG 11.6.2",
                "metric_template": [
                    {"code": "pm2_5", "label": "PM2.5", "unit": "µg/m³", "type": "number", "required": True},
                    {"code": "pm10", "label": "PM10", "unit": "µg/m³", "type": "number", "required": True},
                    {"code": "no2", "label": "Nitrogen Dioxide (NO2)", "unit": "ppb", "type": "number", "required": False},
                    {"code": "so2", "label": "Sulfur Dioxide (SO2)", "unit": "ppb", "type": "number", "required": False},
                ],
            },
            # SOIL & LAND
            {
                "domain": DomainChoices.SOIL,
                "name": "Soil Chemistry & Health",
                "sdg_alignment": "SDG 15.3.1",
                "metric_template": [
                    {"code": "soil_ph", "label": "Soil pH", "unit": "pH", "type": "number", "required": True},
                    {"code": "organic_matter", "label": "Organic Matter", "unit": "%", "type": "number", "required": False},
                    {"code": "salinity", "label": "Soil Salinity", "unit": "dS/m", "type": "number", "required": False},
                ],
            },
            # ECOLOGY & VEGETATION
            {
                "domain": DomainChoices.ECOLOGY,
                "name": "Forest & Canopy Health",
                "sdg_alignment": "SDG 15.1.1",
                "metric_template": [
                    {"code": "canopy_cover", "label": "Canopy Density", "unit": "%", "type": "number", "required": True},
                    {"code": "vegetation_health", "label": "Overall Health Rating", "unit": "text", "type": "select", "options": ["Good", "Degraded", "Severe"], "required": True},
                ],
            },
        ]

        count = 0
        try:
            for data in subdomains_data:
                obj, created = ObservationSubdomain.objects.update_or_create(
                    name=data["name"],
                    defaults={
                        "domain": data["domain"],
                        "sdg_alignment": data["sdg_alignment"],
                        "metric_template": data["metric_template"],
                    },
                )
                if created:
                    count += 1

            msg = f"Successfully seeded {len(subdomains_data)} subdomains ({count} new created)."
            logger.info(msg)
            self.stdout.write(self.style.SUCCESS(msg))

        except Exception as e:
            err_msg = f"Failed to seed subdomains: {str(e)}"
            logger.error(err_msg, exc_info=True)
            self.stderr.write(self.style.ERROR(err_msg))