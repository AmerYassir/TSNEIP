// ==========================================
// 1. UI & Application State Types
// ==========================================

export type Language = 'ar' | 'en';

export type AppView = 'home' | 'map' | 'forms' | 'blog' | 'analytics' | 'about';

export type VerificationStatus = 'verified' | 'pending' | 'needs_audit' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export type LayerId = 
  | 'env_baseline' 
  | 'water_resources' 
  | 'land_cover' 
  | 'biodiversity' 
  | 'field_surveys'
  | 'air_quality';
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
  id: string;
  code: string;
  labelAr: string;
  labelEn: string;
  color: string;
}

// -------------------------------------------------------------
// Django Backend Domain & Observation Types
// -------------------------------------------------------------
export interface MetricReading {
  id?: string;
  parameter_code: string;
  numeric_value?: number | null;
  text_value?: string | null;
  unit: string;
}

export interface ObservationSubdomain {
  id: string; // UUID
  domain: string;
  domain_display?: string;
  name: string;
  sdg_alignment: string;
  metric_template: {
    parameters: Array<{
      code: string;
      label_ar?: string;
      label_en?: string;
      name?: string;
      type: 'numeric' | 'text' | 'choice';
      unit: string;
      required?: boolean;
      min_value?: number;
      max_value?: number;
    }>;
  } | Record<string, any>;
}

export interface GeoObservation {
  id: string; // UUID
  title: string;
  subdomain: string; // UUID
  subdomain_detail?: ObservationSubdomain;
  latitude?: number;
  longitude?: number;
  altitude?: number | null;
  observation_time: string; // ISO DateTime
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  readings: MetricReading[];
  created_at?: string;
}

export interface GeoObservationCreatePayload {
  title: string;
  subdomain: string; // UUID
  latitude: number;
  longitude: number;
  altitude?: number | null;
  observation_time: string; // ISO string
  readings?: MetricReading[];
}

// GeoJSON Feature for Map
export interface GeoObservationGeoFeature {
  id: string;
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  properties: {
    id: string;
    status: string;
    observation_time: string;
    created_at: string;
    title?: string;
    subdomain_name?: string;
  };
}

export interface GeoJsonPaginationResponse<T> {
  type: 'FeatureCollection';
  count: number;
  next: string | null;
  previous: string | null;
  features: T[];
}

// -------------------------------------------------------------
// Django Backend Survey & Dynamic Form Types
// -------------------------------------------------------------
export interface SurveySchemaField {
  name: string;
  label_ar: string;
  label_en: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'checkbox' | 'date';
  options?: Array<{ value: string; label_ar: string; label_en: string }>;
  required?: boolean;
  unit?: string;
  placeholder_ar?: string;
  placeholder_en?: string;
}

export interface SurveySchema {
  fields: SurveySchemaField[];
  category?: string;
  governorate_required?: boolean;
}

export interface SurveyForm {
  id: string; // UUID
  title_ar: string;
  title_en: string;
  slug: string;
  description_ar: string;
  description_en: string;
  schema: SurveySchema;
  version: number;
  is_active: boolean;
  created_by?: string;
  created_by_username?: string;
  created_at: string;
  updated_at: string;
}

export interface FormSubmission {
  id: string; // UUID
  form: string; // UUID
  form_title?: string;
  data: Record<string, any>;
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  } | null;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | string;
  submitted_by?: string | null;
  submitted_by_username?: string;
  created_at: string;
  updated_at?: string;
}

export interface FormSubmissionCreatePayload {
  form: string; // UUID
  data: Record<string, any>;
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  } | null;
}

// -------------------------------------------------------------
// Django Backend Taxonomy & SDGs
// -------------------------------------------------------------
export interface SDGGoal {
  id: string;
  code: string;
  number: number;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  color_hex: string;
  icon?: string;
}

export interface EcosystemThreatCategory {
  id: string;
  code: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
}

// -------------------------------------------------------------
// Django Backend Organizations
// -------------------------------------------------------------
export interface Organization {
  id: string;
  name: string;
  code: string;
  org_type: string;
  org_type_display?: string;
  description: string;
  website: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// -------------------------------------------------------------
// Django Backend Content & Articles
// -------------------------------------------------------------
export interface ArticleCategory {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
}

export interface Article {
  id: string;
  title_ar: string;
  title_en: string;
  slug: string;
  summary_ar: string;
  summary_en: string;
  content_ar?: string;
  content_en?: string;
  category?: ArticleCategory;
  featured_image?: string | null;
  author_name?: string;
  author?: string;
  is_published?: boolean;
  published_at: string;
  created_at?: string;
  updated_at?: string;
}

export interface Publication {
  id: string;
  title_ar: string;
  title_en: string;
  summary_ar: string;
  summary_en: string;
  file: string;
  cover_image?: string | null;
  published_at: string;
  created_at: string;
}

// -------------------------------------------------------------
// Django Backend Locations / Administrative Units
// -------------------------------------------------------------
export interface AdministrativeUnit {
  id: string;
  name: string;
  code: string;
  level: number;
  parent?: string | null;
  parent_name?: string;
  created_at: string;
}

// -------------------------------------------------------------
// Django Backend Analytics
// -------------------------------------------------------------
export interface AnalyticsSummary {
  total_observations: number;
  approved_observations?: number;
  verified_rate: number;
  avg_ndvi: number;
  critical_hotspots: number;
  sdg_distribution: Array<{
    sdgs__code: string;
    sdgs__title_en: string;
    count: number;
  }>;
  governorate_breakdown: Array<{
    governorate: string;
    count: number;
  }>;
  layer_distribution: Array<{
    layer: string;
    count: number;
  }>;
  survey_growth_timeline: Array<{
    month: string;
    count: number;
  }>;
}

export interface SdgReport {
  observations_by_sdg?: Array<{ subdomain__sdg_alignment: string; count: number }>;
  summary?: Record<string, any>;
}

// -------------------------------------------------------------
// Django Backend Users & Auth
// -------------------------------------------------------------
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  organization?: string | null;
  organization_detail?: Organization | null;
  role: 'FIELD_OFFICER' | 'SCIENTIFIC_REVIEWER' | 'ADMIN' | 'PUBLIC_CONTRIBUTOR' | string;
  role_display?: string;
  is_active: boolean;
  date_joined: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
  user: UserProfile;
}

// -------------------------------------------------------------
// UI Adapter & Legacy Compatibility Structures
// -------------------------------------------------------------
export interface GeoPointRecord {
  id: string;
  siteNameAr: string;
  siteNameEn: string;
  governorate: SyrianGovernorate | string;
  lat: number;
  lng: number;
  elevation: number;
  layerId: LayerId;
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
  backendRaw?: GeoObservation;

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
  selectedLayerIds: LayerId[];
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
  status: 'draft' | 'submitted' | 'verified' | string;
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
