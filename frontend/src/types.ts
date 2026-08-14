export type Language = 'ar' | 'en';

export type AppView = 'home' | 'map' | 'forms' | 'blog' | 'analytics' | 'about';

export type VerificationStatus = 'verified' | 'pending' | 'needs_audit';

export type LayerId = 
  | 'env_baseline' 
  | 'water_resources' 
  | 'land_cover' 
  | 'biodiversity' 
  | 'field_surveys'
  | 'air_quality';

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

export interface SdgTag {
  id: string;
  code: 'SDG6' | 'SDG13' | 'SDG15' | 'SDG14' | 'SDG7' | 'SDG11';
  labelAr: string;
  labelEn: string;
  color: string;
}

export interface GeoPointRecord {
  id: string; // e.g., SY-ENV-2026-001
  siteNameAr: string;
  siteNameEn: string;
  governorate: SyrianGovernorate;
  lat: number;
  lng: number;
  elevation: number; // meters
  layerId: LayerId;
  sdgTags: SdgTag[];
  verificationStatus: VerificationStatus;
  collectedDate: string; // YYYY-MM-DD
  collectorName: string;
  collectorTeam: string;
  metrics: {
    ndvi?: number; // Normalized Difference Vegetation Index (0-1)
    waterPh?: number;
    waterSalinityPpm?: number;
    biodiversityIndex?: number; // 0-100
    soilOrganicContent?: number; // %
    airQualityIndex?: number; // AQI
    ambientTempC?: number;
  };
  notesAr: string;
  notesEn: string;
  imageUrl?: string;
  threatLevel: 'low' | 'moderate' | 'high' | 'critical';
}

export interface SpatialLayerConfig {
  id: LayerId;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  color: string;
  iconName: string;
  active: boolean;
  pointCount: number;
}

export interface MapFilterState {
  searchQuery: string;
  selectedGovernorate: string; // 'all' or specific governorate
  selectedLayerIds: LayerId[];
  selectedStatus: string; // 'all' | 'verified' | 'pending' | 'needs_audit'
  selectedSdg: string; // 'all' | specific SDG code
  threatFilter: string; // 'all' | 'critical' etc.
  dateRange: {
    start: string;
    end: string;
  };
}

export type BasemapType = 'osm' | 'satellite' | 'topo' | 'dark' | 'terrain';

// Form Templates Types
export type FormTemplateId = 
  | 'biodiversity'
  | 'water_quality'
  | 'soil_forest'
  | 'demographic_impact'
  | 'protected_area';

export interface FormSubmissionRecord {
  id: string; // e.g., FORM-BIO-2026-881
  templateId: FormTemplateId;
  titleAr: string;
  titleEn: string;
  governorate: SyrianGovernorate;
  lat: number;
  lng: number;
  collectedDate: string;
  inspectorName: string;
  organization: string;
  status: 'draft' | 'submitted' | 'verified';
  formData: Record<string, any>;
  notesAr?: string;
  notesEn?: string;
  photoUrl?: string;
  createdAt: string;
}

// Blog & Partner Types
export type BlogCategory = 'all' | 'news' | 'research' | 'field' | 'partner' | 'biodiversity';

export interface BlogPost {
  id: string;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  contentAr: string[];
  contentEn: string[];
  category: BlogCategory;
  authorAr: string;
  authorEn: string;
  authorRoleAr: string;
  authorRoleEn: string;
  date: string;
  readTimeMinutes: number;
  imageUrl: string;
  sdgTags: SdgTag[];
  featured?: boolean;
  relatedDatasetId?: string;
}

export interface PlatformPartner {
  id: string;
  nameAr: string;
  nameEn: string;
  typeAr: string;
  typeEn: string;
  logoUrl: string;
  descriptionAr: string;
  descriptionEn: string;
  roleAr: string;
  roleEn: string;
  website: string;
  datasetsCount: number;
  establishedYear: number;
  badgeColor: string;
}

