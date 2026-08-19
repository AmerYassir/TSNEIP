// ==========================================
// 1. UI & Application State Types
// ==========================================

export type Language = 'ar' | 'en';

export type AppView = 'home' | 'map' | 'forms' | 'blog' | 'analytics' | 'about';

export type BasemapType = 'osm' | 'satellite' | 'topo' | 'dark' | 'terrain';

export type SyrianGovernorate = 
  | 'Damascus'
  | 'Rural Damascus'
  | 'Aleppo'
  | 'Homs'
  | 'Hama'
  | 'Latakia'
  | 'Tartus'
  | 'Idlib'
  | 'Deir ez-Zor'
  | 'Raqqa'
  | 'Hasakah'
  | 'Daraa'
  | 'Suwayda'
  | 'Quneitra';

// ==========================================
// 2. Auth & User Management Types
// ==========================================

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: 'admin' | 'researcher' | 'inspector' | 'viewer';
  organization?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

// ==========================================
// 3. Generic DRF API & GeoJSON Response Wrappers
// ==========================================

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface GeoJsonPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface GeoJsonFeature<P = Record<string, unknown>> {
  id?: number | string;
  type: 'Feature';
  geometry: GeoJsonPoint;
  properties: P;
}

export interface GeoJsonFeatureCollection<P = Record<string, unknown>> {
  type: 'FeatureCollection';
  features: GeoJsonFeature<P>[];
}

// ==========================================
// 4. Ecosystem Observation & Metric Types
// ==========================================

export type VerificationStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'needs_audit';

export type ThreatLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface SdgTag {
  id: number | string;
  code: 'SDG6' | 'SDG13' | 'SDG15' | 'SDG14' | 'SDG7' | 'SDG11';
  label_ar: string;
  label_en: string;
  color: string;
}

export interface ObservationMetrics {
  ndvi?: number;
  water_ph?: number;
  water_salinity_ppm?: number;
  biodiversity_index?: number;
  soil_organic_content?: number;
  air_quality_index?: number;
  ambient_temp_c?: number;
}

// Full Observation Model aligned with Django Serializer
export interface Observation {
  id: number | string;
  record_code?: string; // e.g. SY-ENV-2026-001
  site_name_ar: string;
  site_name_en: string;
  governorate: SyrianGovernorate;
  location: GeoJsonPoint; // GeoJSON Point format from PostGIS
  elevation?: number;
  layer_id: string;
  sdg_tags: SdgTag[];
  status: VerificationStatus;
  threat_level: ThreatLevel;
  collected_date: string; // YYYY-MM-DD
  collector_name: string;
  collector_team?: string;
  metrics?: ObservationMetrics;
  notes_ar?: string;
  notes_en?: string;
  image_url?: string;
  observer?: number; // User ID
  created_at?: string;
  updated_at?: string;
}

// Backward-compatible UI Record interface (for existing components prior to API refactor)
export interface GeoPointRecord {
  id: string;
  siteNameAr: string;
  siteNameEn: string;
  governorate: SyrianGovernorate;
  lat: number;
  lng: number;
  elevation: number;
  layerId: string;
  sdgTags: SdgTag[];
  verificationStatus: VerificationStatus;
  collectedDate: string;
  collectorName: string;
  collectorTeam: string;
  metrics: {
    ndvi?: number;
    waterPh?: number;
    waterSalinityPpm?: number;
    biodiversityIndex?: number;
    soilOrganicContent?: number;
    airQualityIndex?: number;
    ambientTempC?: number;
  };
  notesAr: string;
  notesEn: string;
  imageUrl?: string;
  threatLevel: ThreatLevel;
}

// ==========================================
// 5. Spatial Layers & Map Filter State
// ==========================================

export type LayerId = 
  | 'env_baseline' 
  | 'water_resources' 
  | 'land_cover' 
  | 'biodiversity' 
  | 'field_surveys'
  | 'air_quality';

export interface SpatialLayerConfig {
  id: LayerId | string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  color: string;
  icon_name: string;
  active: boolean;
  point_count: number;
}

export interface MapFilterState {
  searchQuery: string;
  selectedGovernorate: string;
  selectedLayerIds: (LayerId | string)[];
  selectedStatus: string;
  selectedSdg: string;
  threatFilter: string;
  dateRange: {
    start: string;
    end: string;
  };
}

// ==========================================
// 6. Eco Forms & Submissions Types
// ==========================================

export type FormTemplateId = 
  | 'biodiversity'
  | 'water_quality'
  | 'soil_forest'
  | 'demographic_impact'
  | 'protected_area';

export interface FormSubmissionRecord {
  id: string;
  template_id: FormTemplateId | string;
  title_ar: string;
  title_en: string;
  governorate: SyrianGovernorate;
  location: GeoJsonPoint;
  collected_date: string;
  inspector_name: string;
  organization: string;
  status: 'draft' | 'submitted' | 'verified';
  form_data: Record<string, unknown>;
  notes_ar?: string;
  notes_en?: string;
  photo_url?: string;
  created_at: string;
}

// ==========================================
// 7. Blog & Partner Types
// ==========================================

export type BlogCategory = 'all' | 'news' | 'research' | 'field' | 'partner' | 'biodiversity';

export interface BlogPost {
  id: number | string;
  title_ar: string;
  title_en: string;
  summary_ar: string;
  summary_en: string;
  content_ar: string[];
  content_en: string[];
  category: BlogCategory;
  author_ar: string;
  author_en: string;
  author_role_ar?: string;
  author_role_en?: string;
  date: string;
  read_time_minutes: number;
  image_url: string;
  sdg_tags: SdgTag[];
  featured?: boolean;
  related_dataset_id?: string;
}

export interface PlatformPartner {
  id: number | string;
  name_ar: string;
  name_en: string;
  type_ar: string;
  type_en: string;
  logo_url: string;
  description_ar: string;
  description_en: string;
  role_ar: string;
  role_en: string;
  website: string;
  datasets_count: number;
  established_year: number;
  badge_color: string;
}