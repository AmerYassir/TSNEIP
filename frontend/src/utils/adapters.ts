import {
  GeoObservation,
  GeoPointRecord,
  LayerId,
  SdgTag,
  VerificationStatus,
  FormSubmission,
  Article,
  BlogPost,
  Organization,
  PlatformPartner,
} from '../types';
import { SDG_TAGS } from '../data/mockData';

/**
 * Maps backend GeoObservation instance to frontend GeoPointRecord
 */
export function geoObservationToGeoPoint(obs: GeoObservation): GeoPointRecord {
  // Determine LayerId from subdomain domain or title
  let layerId: LayerId = 'env_baseline';
  const domain = obs.subdomain_detail?.domain?.toLowerCase() || '';
  const subName = obs.subdomain_detail?.name?.toLowerCase() || '';

  if (domain.includes('water') || subName.includes('water') || subName.includes('مياه') || subName.includes('حوض')) {
    layerId = 'water_resources';
  } else if (domain.includes('bio') || subName.includes('biodiversity') || subName.includes('حيوي') || subName.includes('غاب')) {
    layerId = 'biodiversity';
  } else if (domain.includes('land') || domain.includes('soil') || subName.includes('تربة') || subName.includes('غطاء')) {
    layerId = 'land_cover';
  } else if (domain.includes('air') || subName.includes('هواء') || subName.includes('مناخ')) {
    layerId = 'air_quality';
  } else if (domain.includes('survey') || subName.includes('مسح')) {
    layerId = 'field_surveys';
  }

  // Verification status mapping
  let verificationStatus: VerificationStatus = 'pending';
  if (obs.status === 'APPROVED') {
    verificationStatus = 'verified';
  } else if (obs.status === 'REJECTED') {
    verificationStatus = 'needs_audit';
  } else {
    verificationStatus = 'pending';
  }

  // Extract readings into structured metrics
  const metrics: GeoPointRecord['metrics'] = {};
  if (Array.isArray(obs.readings)) {
    for (const r of obs.readings) {
      const code = (r.parameter_code || '').toUpperCase();
      const val = typeof r.numeric_value === 'number' ? r.numeric_value : parseFloat(r.numeric_value as any);
      if (!isNaN(val)) {
        if (code.includes('NDVI')) metrics.ndvi = val;
        else if (code.includes('PH')) metrics.waterPh = val;
        else if (code.includes('SALIN') || code.includes('TDS') || code.includes('PPM')) metrics.waterSalinityPpm = val;
        else if (code.includes('BIO')) metrics.biodiversityIndex = val;
        else if (code.includes('ORGANIC') || code.includes('SOIL')) metrics.soilOrganicContent = val;
        else if (code.includes('AQI') || code.includes('AIR')) metrics.airQualityIndex = val;
        else if (code.includes('TEMP')) metrics.ambientTempC = val;
      }
    }
  }

  // Extract SDG Tag
  const sdgAlignment = obs.subdomain_detail?.sdg_alignment;
  const sdgTags: SdgTag[] = [];
  if (sdgAlignment && SDG_TAGS[sdgAlignment]) {
    sdgTags.push(SDG_TAGS[sdgAlignment]);
  } else {
    sdgTags.push(SDG_TAGS.SDG15);
  }

  const collectedDate = obs.observation_time 
    ? obs.observation_time.split('T')[0] 
    : (obs.created_at ? obs.created_at.split('T')[0] : new Date().toISOString().split('T')[0]);

  return {
    id: obs.id,
    siteNameAr: obs.title,
    siteNameEn: obs.title,
    governorate: 'Damascus',
    lat: typeof obs.latitude === 'number' ? obs.latitude : 33.5138,
    lng: typeof obs.longitude === 'number' ? obs.longitude : 36.2765,
    elevation: obs.altitude || 450,
    layerId,
    sdgTags,
    verificationStatus,
    collectedDate,
    collectorName: 'فريق TSNEIP الوطني',
    collectorTeam: obs.subdomain_detail?.name || 'المرصد البيئي السوري',
    metrics,
    notesAr: obs.subdomain_detail?.name ? `مجال الرصد: ${obs.subdomain_detail.name}` : 'ملاحظة مسح بيئي معتمد في النظام.',
    notesEn: obs.subdomain_detail?.name ? `Observation Subdomain: ${obs.subdomain_detail.name}` : 'Official TSNEIP Field Observation Record.',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    threatLevel: obs.status === 'REJECTED' ? 'critical' : 'moderate',
    backendRaw: obs,
  };
}

/**
 * Maps backend FormSubmission to GeoPointRecord
 */
export function formSubmissionToGeoPoint(sub: FormSubmission): GeoPointRecord {
  const coords = sub.location?.coordinates || [36.2765, 33.5138];
  const lng = coords[0];
  const lat = coords[1];
  const data = sub.data || {};

  return {
    id: sub.id,
    siteNameAr: sub.form_title || data.site_name_ar || data.site_name || `استمارة بيئية ${sub.id.slice(0, 8)}`,
    siteNameEn: sub.form_title || data.site_name_en || `Survey Form ${sub.id.slice(0, 8)}`,
    governorate: data.governorate || 'Damascus',
    lat,
    lng,
    elevation: data.elevation || 450,
    layerId: 'field_surveys',
    sdgTags: [SDG_TAGS.SDG15, SDG_TAGS.SDG13],
    verificationStatus: sub.status === 'VERIFIED' ? 'verified' : 'pending',
    collectedDate: sub.created_at ? sub.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
    collectorName: sub.submitted_by_username || 'باحث ميداني',
    collectorTeam: 'فريق استمارات المسح الميداني',
    metrics: {
      biodiversityIndex: data.biodiversity_index,
      waterPh: data.water_ph,
      waterSalinityPpm: data.salinity_ppm,
      soilOrganicContent: data.soil_organic,
    },
    notesAr: typeof data.notes === 'string' ? data.notes : 'بيانات استمارة ميدانية مسجلة عبر المنصة.',
    notesEn: typeof data.notes === 'string' ? data.notes : 'Survey form field data captured via TSNEIP platform.',
    imageUrl: data.photo_url || 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80',
    threatLevel: 'moderate',
  };
}

/**
 * Maps backend Article to BlogPost
 */
export function articleToBlogPost(article: Article): BlogPost {
  let category: BlogPost['category'] = 'news';
  const catSlug = article.category?.slug?.toLowerCase() || '';
  if (catSlug.includes('research') || catSlug.includes('دراسات')) category = 'research';
  else if (catSlug.includes('field') || catSlug.includes('ميدان')) category = 'field';
  else if (catSlug.includes('partner') || catSlug.includes('شركاء')) category = 'partner';
  else if (catSlug.includes('bio') || catSlug.includes('حيوي')) category = 'biodiversity';

  const contentParagraphs = article.content_ar 
    ? article.content_ar.split('\n\n').filter(Boolean)
    : (article.summary_ar ? [article.summary_ar] : ['لا يوجد نص إضافي']);

  const contentEnParagraphs = article.content_en
    ? article.content_en.split('\n\n').filter(Boolean)
    : (article.summary_en ? [article.summary_en] : ['No additional content provided.']);

  return {
    id: article.id,
    titleAr: article.title_ar,
    titleEn: article.title_en,
    summaryAr: article.summary_ar,
    summaryEn: article.summary_en,
    contentAr: contentParagraphs,
    contentEn: contentEnParagraphs,
    category,
    authorAr: article.author_name || 'هيئة تحرير المنصة',
    authorEn: article.author_name || 'TSNEIP Editorial Board',
    authorRoleAr: 'باحث رئيسي في النظم البيئية',
    authorRoleEn: 'Lead Environmental GIS Researcher',
    date: article.published_at ? article.published_at.split('T')[0] : '2026-05-15',
    readTimeMinutes: Math.max(3, Math.ceil((article.summary_ar.length + (article.content_ar?.length || 0)) / 400)),
    imageUrl: article.featured_image || 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    sdgTags: [SDG_TAGS.SDG15, SDG_TAGS.SDG13],
    featured: true,
  };
}

/**
 * Maps backend Organization to PlatformPartner
 */
export function organizationToPartner(org: Organization): PlatformPartner {
  let badgeColor = '#006BB2';
  if (org.org_type === 'GOVERNMENT' || org.org_type === 'MINISTRY') badgeColor = '#009600';
  else if (org.org_type === 'UN' || org.org_type === 'INTERNATIONAL') badgeColor = '#0A97D9';
  else if (org.org_type === 'ACADEMIC') badgeColor = '#7C3AED';

  return {
    id: org.id,
    nameAr: org.name,
    nameEn: org.name,
    typeAr: org.org_type_display || org.org_type,
    typeEn: org.org_type_display || org.org_type,
    logoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    descriptionAr: org.description || 'شريك استراتيجي في إدارة وتوثيق البيانات البيئية والمكانية السورية.',
    descriptionEn: org.description || 'Strategic partner in managing and verifying Syrian environmental and spatial data.',
    roleAr: 'تكامل مباشر للبيانات والتحقق الميداني',
    roleEn: 'Direct Data Ingestion & Field Verification',
    website: org.website || 'https://altatweer.org.sy',
    datasetsCount: 12,
    establishedYear: org.created_at ? new Date(org.created_at).getFullYear() : 2026,
    badgeColor,
  };
}
