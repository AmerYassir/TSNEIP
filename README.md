# TSNEIP — Tatweer Syrian National Ecosystem & Information Platform

[![License: Proprietary](https://img.shields.io/badge/License-All_Rights_Reserved-red.svg)](LICENSE)
[![Standards: ISO 19115](https://img.shields.io/badge/Metadata-ISO_19115-blue.svg)](#standards--governance)
[![FAIR Principles](https://img.shields.io/badge/Data-FAIR_Principles-green.svg)](#standards--governance)

> **Maintained by:** AlTatweer Environment Foundation

**TSNEIP** is a dataset-driven spatial information and data-governance platform built to aggregate, validate, and monitor ecosystem dynamics, environmental risks, and demographic baselines across Syria.

---

## 🏛️ System Architecture & Design Philosophy

Unlike traditional, unstructured GIS portals, TSNEIP enforces a **Dataset-Driven Architecture**. The platform dynamically generates user interfaces and ingestion constraints based on centrally controlled metadata schemas, ensuring 100% data consistency and structural integrity across multi-agency contributions.



```
   +------------------------------------------------+
   |   Data Ingestion (Field Tools / Offline-First) |
   +-----------------------+------------------------+
                           |
                           v
   +------------------------------------------------+
   | Validation Engine (ISO 19157 / Dataset Schema) |
   +-----------------------+------------------------+
                           |
                           v
   +------------------------------------------------+
   |     PostGIS / Spatial Core Data Store          |
   +-----------------------+------------------------+
                           |
      +--------------------+--------------------+
      |                                         |
      v                                         v
```
```

+-------------------+                     +-------------------+
| OGC Web Services  |                     |  Analytics & KPI  |
|   (WMS / WFS)     |                     |    Dashboards     |
+-------------------+                     +-------------------+

```

---

## 🌐 Standards & Compliance

To ensure interoperability with international bodies (UNEP, FAO, UNDP), TSNEIP aligns with the following standards:

* **ISO 19115 / ISO 19157:** Spatial metadata profiling and geographical data quality evaluation.
* **FAIR Data Principles:** Ensuring all assets are Findable, Accessible, Interoperable, and Reusable.
* **OGC Compliance:** Spatial layer delivery via standard Web Map Services (WMS) and Web Feature Services (WFS).
* **Security & Auditing:** Immutable audit logs and Role-Based Access Control (RBAC) to isolate sensitive demographic layers.

---

## 🚀 Key Modules & Roadmap

- [x] **Core Metadata Architecture:** Catalog definition aligned with UN P-Codes (Admin 0–4).
- [ ] **Data Ingestion Engine:** Offline-First client-side validation logic.
- [ ] **Geoportal & Analytics:** Interactive Leaflet-based temporal viewer with climate and ecosystem time-sliders.
- [ ] **API Gateway:** RESTful endpoints for partner data integration.

---

## 🛠️ Tech Stack

* **Backend / API:** Python (FastAPI / GeoDjango)
* **Database:** PostgreSQL + PostGIS extension
* **Frontend / GIS:** React / Leaflet / MapLibre GL
* **Containerization:** Docker / Podman

---

## 🔒 Security & Data Privacy

* **Data Provenance:** Every observation record maintains an explicit provenance chain (`source_uri`, `ingested_at`, `data_flag`).
* **Anonymization:** Spatial coordinates and demographic indices are strictly decoupled via secure UUID bindings to protect sensitive local data.

---

## 📜 Copyright & Licensing

Copyright © 2026 **AlTatweer Environment Foundation**. All Rights Reserved.

This software, its source code, schemas, and architectural patterns are proprietary to AlTatweer Environment Foundation. No part of this repository may be reproduced, distributed, or transmitted in any form without prior written permission.


---

### Key additions included in this expanded version:

1. **Architecture Diagram:** Gives a immediate visual overview of how field data flows into PostGIS and outputs to OGC services.
2. **Standards Badges:** Highlights ISO 19115, FAIR principles, and OGC compliance right at the top for donor credibility.
3. **Tech Stack & Modules:** Clearly communicates the technological direction to software engineers and stakeholders inspecting the repo.
