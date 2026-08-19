import React, { useState, useEffect } from 'react';
import { 
  Language, 
  SyrianGovernorate, 
  GeoPointRecord, 
  FormTemplateId, 
  LayerId
} from '../types';
import { translations } from '../data/translations';
import { 
  FileText, 
  Leaf, 
  Droplets, 
  Trees, 
  Home, 
  ShieldAlert, 
  Save, 
  Eye, 
  CheckCircle2, 
  MapPin, 
  Camera, 
  Printer, 
  AlertCircle,
  Loader2,
  Send,
  User,
  Users,
  Layers,
  Award
} from 'lucide-react';

interface EcoFormsHubProps {
  lang: Language;
  onRecordSubmitted: (record: GeoPointRecord) => void;
  onOpenMapPicker: () => void;
  pickedLat?: number;
  pickedLng?: number;
  apiEndpoint?: string; // Optional custom backend API URL (Defaults to /api/v1/observations/)
}

const GOVERNORATES: SyrianGovernorate[] = [
  'Damascus',
  'Rural Damascus',
  'Aleppo',
  'Homs',
  'Hama',
  'Latakia',
  'Tartus',
  'Idlib',
  'Deir ez-Zor',
  'Raqqa',
  'Hasakah',
  'Daraa',
  'Suwayda',
  'Quneitra',
];

export const EcoFormsHub: React.FC<EcoFormsHubProps> = ({
  lang,
  onRecordSubmitted,
  onOpenMapPicker,
  pickedLat,
  pickedLng,
  apiEndpoint = '/api/v1/observations/',
}) => {
  const t = translations[lang];

  // Selected template & view state
  const [activeTemplate, setActiveTemplate] = useState<FormTemplateId>('biodiversity');
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  // API Interaction States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string | null>(null);

  // Base Form Field States
  const [siteNameAr, setSiteNameAr] = useState<string>('');
  const [siteNameEn, setSiteNameEn] = useState<string>('');
  const [governorate, setGovernorate] = useState<SyrianGovernorate>('Latakia');
  const [lat, setLat] = useState<number>(35.8542);
  const [lng, setLng] = useState<number>(35.9814);
  const [elevation, setElevation] = useState<number>(450);
  const [inspectorName, setInspectorName] = useState<string>('م. طارق الشامي');
  const [inspectorTeam, setInspectorTeam] = useState<string>('فريق مسح البيئة الوطنية');
  const [threatLevel, setThreatLevel] = useState<'low' | 'moderate' | 'high' | 'critical'>('moderate');
  const [notesAr, setNotesAr] = useState<string>('');
  const [notesEn, setNotesEn] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80'
  );

  // Specific Form Template Details
  // 1. Biodiversity Template
  const [speciesNameAr, setSpeciesNameAr] = useState<string>('شوح سوري (Abies cilicica)');
  const [speciesCategory, setSpeciesCategory] = useState<string>('flora');
  const [populationCount, setPopulationCount] = useState<number>(120);
  const [biodiversityIndex, setBiodiversityIndex] = useState<number>(85);

  // 2. Water Quality Template
  const [waterBodyType, setWaterBodyType] = useState<string>('spring');
  const [waterPh, setWaterPh] = useState<number>(7.6);
  const [waterSalinityPpm, setWaterSalinityPpm] = useState<number>(320);
  const [dischargeRate, setDischargeRate] = useState<number>(3.5);

  // 3. Soil & Forest Degradation Template
  const [erosionType, setErosionType] = useState<string>('water_runoff');
  const [soilOrganicContent, setSoilOrganicContent] = useState<number>(4.8);
  const [burnedHectares, setBurnedHectares] = useState<number>(0);
  const [replantedSaplings, setReplantedSaplings] = useState<number>(500);

  // 4. Syrian Demographic Eco-Impact Template
  const [householdCount, setHouseholdCount] = useState<number>(450);
  const [primaryFuel, setPrimaryFuel] = useState<string>('solar_hybrid');
  const [wellReliancePercent, setWellReliancePercent] = useState<number>(65);

  // 5. Protected Reserve Incident Template
  const [reserveName, setReserveName] = useState<string>('محمية غابات الفرنلق');
  const [incidentType, setIncidentType] = useState<string>('logging_prevention');
  const [patrolSquadId, setPatrolSquadId] = useState<string>('SQUAD-ALPHA-04');

  // Update Lat/Lng when map picker returns new coordinates
  useEffect(() => {
    if (pickedLat !== undefined && pickedLng !== undefined) {
      setLat(pickedLat);
      setLng(pickedLng);
    }
  }, [pickedLat, pickedLng]);

  // Construct metric object based on active template
  const buildTemplateMetrics = () => {
    switch (activeTemplate) {
      case 'biodiversity':
        return { layerId: 'biodiversity' as LayerId, metrics: { biodiversityIndex, ambientTempC: 25.0 } };
      case 'water_quality':
        return { layerId: 'water_resources' as LayerId, metrics: { waterPh, waterSalinityPpm, dischargeRate } };
      case 'soil_forest':
        return { layerId: 'field_surveys' as LayerId, metrics: { soilOrganicContent, burnedHectares, replantedSaplings, ndvi: 0.65 } };
      case 'demographic_impact':
        return { layerId: 'air_quality' as LayerId, metrics: { airQualityIndex: 45, wellReliancePercent, ambientTempC: 28.0 } };
      case 'protected_area':
        return { layerId: 'env_baseline' as LayerId, metrics: { biodiversityIndex: 90 } };
      default:
        return { layerId: 'field_surveys' as LayerId, metrics: {} };
    }
  };

  // Build specific detail payload for backend JSONField
  const buildTemplateDetails = () => {
    switch (activeTemplate) {
      case 'biodiversity':
        return { speciesNameAr, speciesCategory, populationCount, biodiversityIndex };
      case 'water_quality':
        return { waterBodyType, waterPh, waterSalinityPpm, dischargeRate };
      case 'soil_forest':
        return { erosionType, soilOrganicContent, burnedHectares, replantedSaplings };
      case 'demographic_impact':
        return { householdCount, primaryFuel, wellReliancePercent };
      case 'protected_area':
        return { reserveName, incidentType, patrolSquadId };
      default:
        return {};
    }
  };

  // Submit Form to REST API Backend
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccessMsg(null);

    const { layerId, metrics } = buildTemplateMetrics();
    const templateDetails = buildTemplateDetails();

    // DRF Payload structure matching GeoJSON/Observation backend models
    const payload = {
      template_id: activeTemplate,
      site_name_ar: siteNameAr || (lang === 'ar' ? `استمارة بيئية ميدانية` : `Field Survey Record`),
      site_name_en: siteNameEn || `Eco Form Submission`,
      governorate,
      latitude: lat,
      longitude: lng,
      elevation,
      location: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      layer_id: layerId,
      collector_name: inspectorName,
      collector_team: inspectorTeam,
      threat_level: threatLevel,
      notes_ar: notesAr || 'تم تسجيل هذه الاستمارة عبر منصة TSNEIP.',
      notes_en: notesEn || 'Registered via TSNEIP Field Survey Portal.',
      image_url: photoUrl,
      metrics,
      template_details: templateDetails,
    };

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(localStorage.getItem('TSNEIP_AUTH_TOKEN') 
            ? { 'Authorization': `Bearer ${localStorage.getItem('TSNEIP_AUTH_TOKEN')}` } 
            : {}),
        },
        body: JSON.stringify(payload),
      });

      let responseData: any = {};
      try {
        responseData = await response.json();
      } catch (e) {
        // Fallback if server returned plain status or HTML
      }

      if (!response.ok) {
        throw new Error(
          responseData?.detail || 
          responseData?.message || 
          (lang === 'ar' ? 'فشل الاتصال بخادم منصة البيانات. تم التخزين المكتبي.' : 'Backend connection error.')
        );
      }

      // Format return object for state update
      const newRecordId = responseData.id || `SY-FORM-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      const newRecord: GeoPointRecord = {
        id: String(newRecordId),
        siteNameAr: payload.site_name_ar,
        siteNameEn: payload.site_name_en,
        governorate,
        lat,
        lng,
        elevation,
        layerId,
        sdgTags: [
          { id: 'sdg-15', code: 'SDG15', labelAr: 'الحياة في البر', labelEn: 'Life on Land', color: '#57B039' },
          { id: 'sdg-13', code: 'SDG13', labelAr: 'العمل المناخي', labelEn: 'Climate Action', color: '#326B32' },
        ],
        verificationStatus: responseData.verification_status || 'verified',
        collectedDate: new Date().toISOString().split('T')[0],
        collectorName: inspectorName,
        collectorTeam: inspectorTeam,
        metrics,
        notesAr: payload.notes_ar,
        notesEn: payload.notes_en,
        imageUrl: photoUrl,
        threatLevel,
      };

      onRecordSubmitted(newRecord);

      setSubmitSuccessMsg(
        lang === 'ar' 
          ? `تم إرسال وحفظ الاستمارة الميدانية بنجاح برقم: ${newRecordId}! وتم ربطها بالخريطة التفاعلية.`
          : `Form submitted and pushed to backend database successfully with ID: ${newRecordId}!`
      );

      setTimeout(() => setSubmitSuccessMsg(null), 7000);
    } catch (err: any) {
      // Offline / Local fallback workflow so field work is never lost
      const fallbackRecordId = `SY-LOCAL-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      const fallbackRecord: GeoPointRecord = {
        id: fallbackRecordId,
        siteNameAr: payload.site_name_ar,
        siteNameEn: payload.site_name_en,
        governorate,
        lat,
        lng,
        elevation,
        layerId,
        sdgTags: [
          { id: 'sdg-15', code: 'SDG15', labelAr: 'الحياة في البر', labelEn: 'Life on Land', color: '#57B039' },
        ],
        verificationStatus: 'pending',
        collectedDate: new Date().toISOString().split('T')[0],
        collectorName: inspectorName,
        collectorTeam: inspectorTeam,
        metrics,
        notesAr: payload.notes_ar,
        notesEn: payload.notes_en,
        imageUrl: photoUrl,
        threatLevel,
      };

      onRecordSubmitted(fallbackRecord);
      setSubmitError(
        lang === 'ar'
          ? `تعذر الاتصال بالخادم المباشر (${err.message}). تم إضافة السجل محلياً بنجاح.`
          : `Server unreachable (${err.message}). Saved locally as draft record.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Draft Save Handler
  const handleSaveDraft = () => {
    const draftData = {
      activeTemplate,
      siteNameAr,
      siteNameEn,
      governorate,
      lat,
      lng,
      elevation,
      inspectorName,
      inspectorTeam,
      threatLevel,
      notesAr,
      notesEn,
      photoUrl,
      templateDetails: buildTemplateDetails(),
      savedAt: new Date().toLocaleString(),
    };
    localStorage.setItem('TSNEIP_FORM_DRAFT', JSON.stringify(draftData));
    alert(lang === 'ar' ? 'تم حفظ مسودة الاستمارة بنجاح في التخزين المحلي!' : 'Form draft saved locally!');
  };

  return (
    <div className="flex-1 bg-[#E3EAEF] text-[#1E293B] overflow-y-auto p-4 md:p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header Title Banner */}
        <div className="bg-[#006BB2] text-white p-6 rounded-2xl shadow-lg border border-blue-400/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 rtl:right-auto rtl:left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="space-y-1 relative z-10">
            <div className="flex items-center gap-2">
              <span className="bg-[#009600] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {lang === 'ar' ? 'نظام النماذج الموحدة' : 'Unified Form Templates'}
              </span>
              <span className="text-blue-200 text-xs font-mono">ISO 14001 GIS Standard</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black font-heading tracking-tight text-white">
              {lang === 'ar' ? 'مركز استمارات رصد البيانات البيئية والديموغرافية' : 'Eco & Demographic Data Entry Templates Hub'}
            </h2>
            <p className="text-xs md:text-sm text-blue-100/90 font-medium max-w-2xl">
              {lang === 'ar'
                ? 'نماذج استبيان ميدانية قياسية متوافقة مع معايير مؤسسة التطوير البيئي لرصد التنوع الحيوي، الموارد المائية، تدهور التربة، وتقييم المجتمعات المحلية.'
                : 'Standardized field collection templates compliant with AlTatweer Foundation guidelines for biodiversity, water, soil degradation & community surveys.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 relative z-10 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-3.5 py-2 text-xs bg-white/15 hover:bg-white/25 text-white rounded-lg border border-white/25 font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4 text-emerald-300" />
              <span>{lang === 'ar' ? 'حفظ مسودة' : 'Save Draft'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                isPreviewMode 
                  ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-400' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-400'
              }`}
            >
              {isPreviewMode ? <FileText className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{isPreviewMode ? (lang === 'ar' ? 'تعديل الاستمارة' : 'Edit Form') : (lang === 'ar' ? 'معاينة الوثيقة' : 'Preview Certificate')}</span>
            </button>
          </div>
        </div>

        {/* Status Alerts */}
        {submitSuccessMsg && (
          <div className="bg-emerald-50 border-2 border-emerald-500 text-emerald-900 p-4 rounded-xl shadow-md flex items-center gap-3 animate-fade-in">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div className="text-xs md:text-sm font-bold">{submitSuccessMsg}</div>
          </div>
        )}

        {submitError && (
          <div className="bg-amber-50 border-2 border-amber-500 text-amber-900 p-4 rounded-xl shadow-md flex items-center gap-3 animate-fade-in">
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
            <div className="text-xs md:text-sm font-bold">{submitError}</div>
          </div>
        )}

        {/* Template Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Template 1: Biodiversity */}
          <button
            type="button"
            onClick={() => setActiveTemplate('biodiversity')}
            className={`p-3.5 rounded-xl border text-right rtl:text-right ltr:text-left transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-xs ${
              activeTemplate === 'biodiversity'
                ? 'bg-white border-[#009600] ring-2 ring-[#009600]/30 shadow-md'
                : 'bg-white/80 hover:bg-white border-[#D1DCE5] text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                SDG 15
              </span>
            </div>
            <div>
              <div className="font-extrabold text-xs text-slate-900 leading-snug">
                {lang === 'ar' ? 'التنوع الحيوي والأنواع' : 'Biodiversity & Species'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {lang === 'ar' ? 'رصد الغطاء النباتي والحيواني' : 'Flora & fauna census'}
              </div>
            </div>
          </button>

          {/* Template 2: Water Quality */}
          <button
            type="button"
            onClick={() => setActiveTemplate('water_quality')}
            className={`p-3.5 rounded-xl border text-right rtl:text-right ltr:text-left transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-xs ${
              activeTemplate === 'water_quality'
                ? 'bg-white border-[#006BB2] ring-2 ring-[#006BB2]/30 shadow-md'
                : 'bg-white/80 hover:bg-white border-[#D1DCE5] text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#006BB2] flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono bg-blue-50 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                SDG 6
              </span>
            </div>
            <div>
              <div className="font-extrabold text-xs text-slate-900 leading-snug">
                {lang === 'ar' ? 'الموارد المائية والأحواض' : 'Water Quality & Aquifers'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {lang === 'ar' ? 'قياس الملوحة والتدفق وpH' : 'Salinity, discharge & pH'}
              </div>
            </div>
          </button>

          {/* Template 3: Soil & Forest */}
          <button
            type="button"
            onClick={() => setActiveTemplate('soil_forest')}
            className={`p-3.5 rounded-xl border text-right rtl:text-right ltr:text-left transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-xs ${
              activeTemplate === 'soil_forest'
                ? 'bg-white border-amber-600 ring-2 ring-amber-500/30 shadow-md'
                : 'bg-white/80 hover:bg-white border-[#D1DCE5] text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Trees className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono bg-amber-50 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                SDG 13
              </span>
            </div>
            <div>
              <div className="font-extrabold text-xs text-slate-900 leading-snug">
                {lang === 'ar' ? 'تدهور التربة والحرائق' : 'Soil & Reforestation'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {lang === 'ar' ? 'الانجراف والمدرجات المائية' : 'Erosion & terracing'}
              </div>
            </div>
          </button>

          {/* Template 4: Demographic Eco Impact */}
          <button
            type="button"
            onClick={() => setActiveTemplate('demographic_impact')}
            className={`p-3.5 rounded-xl border text-right rtl:text-right ltr:text-left transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-xs ${
              activeTemplate === 'demographic_impact'
                ? 'bg-white border-purple-600 ring-2 ring-purple-500/30 shadow-md'
                : 'bg-white/80 hover:bg-white border-[#D1DCE5] text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                <Home className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono bg-purple-50 text-purple-800 font-bold px-1.5 py-0.5 rounded">
                SDG 11
              </span>
            </div>
            <div>
              <div className="font-extrabold text-xs text-slate-900 leading-snug">
                {lang === 'ar' ? 'الأثر الديموغرافي السوري' : 'Demographic Eco-Impact'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {lang === 'ar' ? 'استهلاك الطاقة والنفايات' : 'Energy & waste patterns'}
              </div>
            </div>
          </button>

          {/* Template 5: Protected Area Patrol */}
          <button
            type="button"
            onClick={() => setActiveTemplate('protected_area')}
            className={`p-3.5 rounded-xl border text-right rtl:text-right ltr:text-left transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-xs ${
              activeTemplate === 'protected_area'
                ? 'bg-white border-red-600 ring-2 ring-red-500/30 shadow-md'
                : 'bg-white/80 hover:bg-white border-[#D1DCE5] text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono bg-red-50 text-red-800 font-bold px-1.5 py-0.5 rounded">
                STRICT
              </span>
            </div>
            <div>
              <div className="font-extrabold text-xs text-slate-900 leading-snug">
                {lang === 'ar' ? 'تفتيش المحميات الطبيعية' : 'Reserve Patrol Log'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {lang === 'ar' ? 'توثيق التهديدات والانتهاكات' : 'Threat & incident record'}
              </div>
            </div>
          </button>
        </div>

        {/* View Mode Switcher: Form Editor vs Certificate Preview */}
        {!isPreviewMode ? (
          /* FORM EDITOR WORKSPACE */
          <form onSubmit={handleSubmitForm} className="bg-white rounded-2xl p-6 shadow-md border border-[#D1DCE5] space-y-6">
            
            {/* Form Section Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#006BB2] text-white flex items-center justify-center font-bold">
                  {activeTemplate === 'biodiversity' && <Leaf className="w-5 h-5 text-emerald-300" />}
                  {activeTemplate === 'water_quality' && <Droplets className="w-5 h-5 text-blue-300" />}
                  {activeTemplate === 'soil_forest' && <Trees className="w-5 h-5 text-amber-300" />}
                  {activeTemplate === 'demographic_impact' && <Home className="w-5 h-5 text-purple-300" />}
                  {activeTemplate === 'protected_area' && <ShieldAlert className="w-5 h-5 text-red-300" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">
                    {activeTemplate === 'biodiversity' && (lang === 'ar' ? 'استمارة مسح التنوع الحيوي والنباتي' : 'Flora & Fauna Biodiversity Survey Form')}
                    {activeTemplate === 'water_quality' && (lang === 'ar' ? 'استمارة فحص الموارد المائية والأحواض' : 'Water Quality & Aquifer Entry Form')}
                    {activeTemplate === 'soil_forest' && (lang === 'ar' ? 'استمارة تقييم تدهور التربة والتصحر' : 'Soil Degradation & Afforestation Log')}
                    {activeTemplate === 'demographic_impact' && (lang === 'ar' ? 'استمارة المسح الديموغرافي والأثر البيئي للمجتمعات' : 'Demographic Eco-Impact Household Survey')}
                    {activeTemplate === 'protected_area' && (lang === 'ar' ? 'تقرير دورية تفتيش المحميات الطبيعية' : 'Protected Reserve Patrol & Threat Incident Log')}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'ar' ? 'الرجاء تعبئة كافة الحقول الميدانية بدقة لضمان الاعتماد المباشر.' : 'Complete all mandatory field inputs to generate valid spatial record.'}
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                {lang === 'ar' ? 'كود النموذج:' : 'Template Code:'} TSNEIP-F-0{
                  activeTemplate === 'biodiversity' ? '1' :
                  activeTemplate === 'water_quality' ? '2' :
                  activeTemplate === 'soil_forest' ? '3' :
                  activeTemplate === 'demographic_impact' ? '4' : '5'
                }
              </div>
            </div>

            {/* General Location & Inspector Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'ar' ? 'اسم الموقع / المحمية (بالعربية) *' : 'Site Name (Arabic) *'}
                </label>
                <input
                  type="text"
                  required
                  value={siteNameAr}
                  onChange={(e) => setSiteNameAr(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: محمية شوح الفرنلق' : 'e.g., Al-Fronlok Reserve'}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#006BB2] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'ar' ? 'اسم الموقع (بالإنكليزية)' : 'Site Name (English)'}
                </label>
                <input
                  type="text"
                  value={siteNameEn}
                  onChange={(e) => setSiteNameEn(e.target.value)}
                  placeholder="e.g., Al-Fronlok Fir Reserve"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#006BB2] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'ar' ? 'المحافظة السورية *' : 'Syrian Governorate *'}
                </label>
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value as SyrianGovernorate)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#006BB2] focus:outline-none bg-white font-semibold"
                >
                  {GOVERNORATES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Spatial Coordinates Box */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#006BB2]" />
                  <span>{lang === 'ar' ? 'الإحداثيات الجغرافية والارتفاع (WGS84)' : 'Spatial Coordinates & Elevation (WGS84)'}</span>
                </span>

                <button
                  type="button"
                  onClick={onOpenMapPicker}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded shadow-xs flex items-center gap-1 transition-all cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'تحديد على الخريطة' : 'Pick on Map'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    {lang === 'ar' ? 'خط العرض (Latitude N)' : 'Latitude (°N)'}
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={lat}
                    onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded focus:ring-2 focus:ring-[#006BB2]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    {lang === 'ar' ? 'خط الطول (Longitude E)' : 'Longitude (°E)'}
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={lng}
                    onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded focus:ring-2 focus:ring-[#006BB2]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    {lang === 'ar' ? 'الارتفاع عن سطح البحر (أمتار)' : 'Elevation (Meters)'}
                  </label>
                  <input
                    type="number"
                    value={elevation}
                    onChange={(e) => setElevation(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded focus:ring-2 focus:ring-[#006BB2]"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Template Inputs */}
            {/* Template 1: Biodiversity */}
            {activeTemplate === 'biodiversity' && (
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-4">
                <h4 className="font-extrabold text-xs text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'ar' ? 'بيانات التنوع الحيوي والأنواع المستهدفة' : 'Species Taxonomy & Bio-Index Inputs'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {lang === 'ar' ? 'اسم النوع (العلمي/المحلي)' : 'Species Name'}
                    </label>
                    <input
                      type="text"
                      value={speciesNameAr}
                      onChange={(e) => setSpeciesNameAr(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {lang === 'ar' ? 'التصنيف البيولوجي' : 'Taxonomy Category'}
                    </label>
                    <select
                      value={speciesCategory}
                      onChange={(e) => setSpeciesCategory(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white font-semibold"
                    >
                      <option value="flora">{lang === 'ar' ? 'نباتي (Flora)' : 'Flora / Plants'}</option>
                      <option value="fauna">{lang === 'ar' ? 'حيواني (Fauna)' : 'Fauna / Mammals'}</option>
                      <option value="birds">{lang === 'ar' ? 'طيور (Avian)' : 'Birds / Raptors'}</option>
                      <option value="marine">{lang === 'ar' ? 'بحري (Marine)' : 'Marine Ecology'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {lang === 'ar' ? 'تعداد التجمع المرصود' : 'Observed Population'}
                    </label>
                    <input
                      type="number"
                      value={populationCount}
                      onChange={(e) => setPopulationCount(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {lang === 'ar' ? 'مؤشر الصحة البيئية (0-100)' : 'Bio Health Index'}
                    </label>
                    <input
                      type="number"
                      max="100"
                      min="0"
                      value={biodiversityIndex}
                      onChange={(e) => setBiodiversityIndex(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Template 2: Water Quality */}
            {activeTemplate === 'water_quality' && (
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 space-y-4">
                <h4 className="font-extrabold text-xs text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  <span>{lang === 'ar' ? 'قياسات جودة الموارد المائية والأحواض' : 'Hydrological & Water Chemistry Inputs'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {lang === 'ar' ? 'نوع المورد المائي' : 'Water Resource Type'}
                    </label>
                    <select
                      value={waterBodyType}
                      onChange={(e) => setWaterBodyType(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white font-semibold"
                    >
                      <option value="spring">{lang === 'ar' ? 'نبع طبيعي' : 'Natural Springhead'}</option>
                      <option value="river">{lang === 'ar' ? 'مجرى نهر' : 'River Basin'}</option>
                      <option value="aquifer">{lang === 'ar' ? 'حوض جوفي' : 'Groundwater Aquifer'}</option>
                      <option value="lake">{lang === 'ar' ? 'بحيرة سد' : 'Dam Lake'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {lang === 'ar' ? 'الرقم الهيدروجيني (pH)' : 'pH Level (6.5 - 8.5)'}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={waterPh}
                      onChange={(e) => setWaterPh(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {lang === 'ar' ? 'نسبة الملوحة (TDS PPM)' : 'Salinity TDS (PPM)'}
                    </label>
                    <input
                      type="number"
                      value={waterSalinityPpm}
                      onChange={(e) => setWaterSalinityPpm(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {lang === 'ar' ? 'تدفق المياه (م³/ثانية)' : 'Discharge Rate (m³/s)'}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={dischargeRate}
                      onChange={(e) => setDischargeRate(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Template 3: Soil & Forest */}
            {activeTemplate === 'soil_forest' && (
              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 space-y-4">
                <h4 className="font-extrabold text-xs text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Trees className="w-4 h-4 text-amber-600" />
                  <span>{lang === 'ar' ? 'بيانات انجراف التربة وتغطية الغابات' : 'Soil Erosion & Forest Degradation Inputs'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {lang === 'ar' ? 'نوع الانجراف المرصود' : 'Erosion Type'}
                    </label>
                    <select
                      value={erosionType}
                      onChange={(e) => setErosionType(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white font-semibold"
                    >
                      <option value="water_runoff">{lang === 'ar' ? 'انجراف مائي' : 'Water Runoff'}</option>
                      <option value="wind_erosion">{lang === 'ar' ? 'انجراف ريحي' : 'Wind Erosion'}</option>
                      <option value="overgrazing">{lang === 'ar' ? 'رعي جائر' : 'Overgrazing'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {lang === 'ar' ? 'نسبة المادة العضوية (%)' : 'Organic Soil Content (%)'}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={soilOrganicContent}
                      onChange={(e) => setSoilOrganicContent(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {lang === 'ar' ? 'المساحة المتضررة (هكتار)' : 'Burned/Damaged Hectares'}
                    </label>
                    <input
                      type="number"
                      value={burnedHectares}
                      onChange={(e) => setBurnedHectares(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {lang === 'ar' ? 'الغراس المستنبتة (غرسة)' : 'Replanted Saplings'}
                    </label>
                    <input
                      type="number"
                      value={replantedSaplings}
                      onChange={(e) => setReplantedSaplings(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Template 4: Demographic Impact */}
            {activeTemplate === 'demographic_impact' && (
              <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-200 space-y-4">
                <h4 className="font-extrabold text-xs text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Home className="w-4 h-4 text-purple-600" />
                  <span>{lang === 'ar' ? 'مؤشرات الأثر الديموغرافي والمجتمعات المجاورة' : 'Demographic & Household Energy Patterns'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {lang === 'ar' ? 'عدد الأسر المشمولة' : 'Surveyed Households'}
                    </label>
                    <input
                      type="number"
                      value={householdCount}
                      onChange={(e) => setHouseholdCount(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {lang === 'ar' ? 'مصدر الطاقة الرئيسي' : 'Primary Fuel Source'}
                    </label>
                    <select
                      value={primaryFuel}
                      onChange={(e) => setPrimaryFuel(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white font-semibold"
                    >
                      <option value="solar_hybrid">{lang === 'ar' ? 'طاقة شمسية هجينة' : 'Solar Hybrid'}</option>
                      <option value="biomass_wood">{lang === 'ar' ? 'حطب وأخشاب' : 'Biomass / Wood'}</option>
                      <option value="diesel">{lang === 'ar' ? 'ديزل / مازوت' : 'Diesel Fuel'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {lang === 'ar' ? 'الاعتماد على الآبار الخاصة (%)' : 'Well Reliance (%)'}
                    </label>
                    <input
                      type="number"
                      max="100"
                      min="0"
                      value={wellReliancePercent}
                      onChange={(e) => setWellReliancePercent(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Template 5: Protected Reserve Patrol */}
            {activeTemplate === 'protected_area' && (
              <div className="bg-red-50/50 p-4 rounded-xl border border-red-200 space-y-4">
                <h4 className="font-extrabold text-xs text-red-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <span>{lang === 'ar' ? 'توثيق دورية حراسة وتدقيق الانتهاكات' : 'Protected Reserve Security & Incident Log'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {lang === 'ar' ? 'اسم المحمية الطبيعية' : 'Reserve Name'}
                    </label>
                    <input
                      type="text"
                      value={reserveName}
                      onChange={(e) => setReserveName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {lang === 'ar' ? 'نوع الحادثة / التهديد' : 'Incident Type'}
                    </label>
                    <select
                      value={incidentType}
                      onChange={(e) => setIncidentType(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white font-semibold text-red-700"
                    >
                      <option value="logging_prevention">{lang === 'ar' ? 'منع تحطيب غير قانوني' : 'Illegal Logging Prevention'}</option>
                      <option value="fire_hazard">{lang === 'ar' ? 'إنذار حريق مبكر' : 'Early Fire Hazard'}</option>
                      <option value="poaching">{lang === 'ar' ? 'صيد جائر' : 'Poaching Enforcement'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {lang === 'ar' ? 'معرف فرقة الدورية' : 'Patrol Squad ID'}
                    </label>
                    <input
                      type="text"
                      value={patrolSquadId}
                      onChange={(e) => setPatrolSquadId(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded bg-white font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Inspector Metadata & Assessment */}
            <div className="border-t border-slate-200 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>{lang === 'ar' ? 'اسم المفتش / جامع البيانات' : 'Collector Name'}</span>
                </label>
                <input
                  type="text"
                  required
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#006BB2]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>{lang === 'ar' ? 'الفريق الميداني' : 'Collector Team'}</span>
                </label>
                <input
                  type="text"
                  value={inspectorTeam}
                  onChange={(e) => setInspectorTeam(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#006BB2]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'ar' ? 'مستوى التهديد البيئي' : 'Threat Level'}
                </label>
                <select
                  value={threatLevel}
                  onChange={(e) => setThreatLevel(e.target.value as any)}
                  className={`w-full px-3 py-2 text-xs border rounded-lg font-bold bg-white ${
                    threatLevel === 'low' ? 'border-emerald-500 text-emerald-700' :
                    threatLevel === 'moderate' ? 'border-amber-500 text-amber-700' :
                    threatLevel === 'high' ? 'border-orange-500 text-orange-700' :
                    'border-red-600 text-red-700'
                  }`}
                >
                  <option value="low">{lang === 'ar' ? 'منخفض (Low)' : 'Low Threat'}</option>
                  <option value="moderate">{lang === 'ar' ? 'متوسط (Moderate)' : 'Moderate Threat'}</option>
                  <option value="high">{lang === 'ar' ? 'مرتفع (High)' : 'High Threat'}</option>
                  <option value="critical">{lang === 'ar' ? 'حرج جداً (Critical)' : 'Critical Threat'}</option>
                </select>
              </div>
            </div>

            {/* Photo URL & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-slate-500" />
                  <span>{lang === 'ar' ? 'رابط الصورة الميدانية (URL)' : 'Field Evidence Photo URL'}</span>
                </label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#006BB2] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'ar' ? 'الملاحظات الميدانية والتوصيات' : 'Field Notes & Observations'}
                </label>
                <textarea
                  rows={2}
                  value={lang === 'ar' ? notesAr : notesEn}
                  onChange={(e) => lang === 'ar' ? setNotesAr(e.target.value) : setNotesEn(e.target.value)}
                  placeholder={lang === 'ar' ? 'أدخل ملاحظات المسح والمقترحات الميدانية...' : 'Enter field notes...'}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#006BB2]"
                />
              </div>
            </div>

            {/* Submit Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#006BB2] hover:bg-[#005590] disabled:bg-slate-400 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{lang === 'ar' ? 'جاري إرسال الاستمارة...' : 'Submitting to Backend...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'اعتماد وإرسال الاستمارة' : 'Submit Eco-Form Record'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* CERTIFICATE / DOCUMENT PREVIEW MODE */
          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-slate-300 space-y-6 print:p-0 print:border-none">
            
            {/* Certificate Print Header */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
                  AlTatweer Foundation for Environmental Studies
                </span>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {lang === 'ar' ? 'شهادة توثيق مسح ميداني بيئي' : 'Official Environmental Field Survey Record'}
                </h1>
                <p className="text-xs text-slate-600 font-mono">
                  TSNEIP Unified Platform • Document ID: SY-CERT-{Math.floor(100000 + Math.random() * 900000)}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2 print:hidden">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'طباعة / تصدير PDF' : 'Print / Export PDF'}</span>
                </button>
              </div>
            </div>

            {/* Document Body Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] font-bold">{lang === 'ar' ? 'الموقع' : 'Site'}</span>
                <span className="font-extrabold text-slate-900">{siteNameAr || 'موقع غير مسمى'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-bold">{lang === 'ar' ? 'المحافظة' : 'Governorate'}</span>
                <span className="font-bold text-slate-900">{governorate}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-bold">{lang === 'ar' ? 'الإحداثيات' : 'Coordinates'}</span>
                <span className="font-mono text-slate-800">{lat.toFixed(4)}°N, {lng.toFixed(4)}°E</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-bold">{lang === 'ar' ? 'جامع البيانات' : 'Collector'}</span>
                <span className="font-bold text-slate-900">{inspectorName}</span>
              </div>
            </div>

            {/* Template Metrics Table */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider border-b pb-1 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#006BB2]" />
                <span>{lang === 'ar' ? 'النتائج والمؤشرات الفنية المرصودة' : 'Recorded Survey Technical Metrics'}</span>
              </h4>

              <table className="w-full text-xs text-right rtl:text-right ltr:text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 font-extrabold text-slate-700">
                    <th className="p-2.5">{lang === 'ar' ? 'المؤشر / المعيار' : 'Metric'}</th>
                    <th className="p-2.5">{lang === 'ar' ? 'القيمة المسجلة' : 'Recorded Value'}</th>
                    <th className="p-2.5">{lang === 'ar' ? 'مستوى التقييم' : 'Evaluation'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {activeTemplate === 'biodiversity' && (
                    <>
                      <tr>
                        <td className="p-2.5 font-bold">{lang === 'ar' ? 'النوع المرصود' : 'Target Species'}</td>
                        <td className="p-2.5">{speciesNameAr}</td>
                        <td className="p-2.5 font-mono text-emerald-700 font-bold">{speciesCategory.toUpperCase()}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">{lang === 'ar' ? 'مؤشر صحة التنوع' : 'Biodiversity Health Index'}</td>
                        <td className="p-2.5 font-mono font-bold">{biodiversityIndex} / 100</td>
                        <td className="p-2.5 text-emerald-600 font-bold">{biodiversityIndex > 70 ? 'ممتاز' : 'متوسط'}</td>
                      </tr>
                    </>
                  )}
                  {activeTemplate === 'water_quality' && (
                    <>
                      <tr>
                        <td className="p-2.5 font-bold">{lang === 'ar' ? 'حموضة المياه (pH)' : 'Water pH'}</td>
                        <td className="p-2.5 font-mono font-bold">{waterPh}</td>
                        <td className="p-2.5 text-blue-700 font-bold">{waterPh >= 6.5 && waterPh <= 8.5 ? 'ضمن المعايير' : 'خارج الحدود'}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">{lang === 'ar' ? 'الملوحة (TDS PPM)' : 'Salinity PPM'}</td>
                        <td className="p-2.5 font-mono font-bold">{waterSalinityPpm} PPM</td>
                        <td className="p-2.5 text-slate-700">{waterSalinityPpm < 500 ? 'عذبة' : 'شديدة الملوحة'}</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {/* Verification Stamp */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <span>{lang === 'ar' ? 'موثق رسمياً برقم تسلسلي غير قابل للتعديل' : 'Digitally Signed & Verified'}</span>
              </div>
              <div className="font-mono text-[10px]">TSNEIP GIS ENGINE v2.4</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};