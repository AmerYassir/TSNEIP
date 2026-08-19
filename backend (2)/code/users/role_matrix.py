# config/role_matrix.py

ROLE_FIELD_PERMISSIONS = {
    "SUPER_ADMIN": {
        "GeoObservation": {
            "read_only": ["location", "subdomain", "created_by"],
        },
        "Intervention": {
            "read_only": ["budget_approved"],
        },
    },
    "REVIEWER": {
        "GeoObservation": {
            "read_only": ["title", "location", "subdomain"],
        },
    },
    "FIELD_AGENT": {
        "GeoObservation": {
            "read_only": ["status", "review_notes"],
        },
    },
    "PUBLIC": {
        "GeoObservation": {
            "read_only": ["status", "review_notes", "created_by"],
            "exclude": ["review_notes"],  # Completely hide internal notes
        },
    },
}