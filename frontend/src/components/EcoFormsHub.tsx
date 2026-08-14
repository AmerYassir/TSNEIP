import React, { useState, useEffect } from 'react';
import { 
  Language, 
  SyrianGovernorate, 
  GeoPointRecord, 
  FormTemplateId, 
  FormSubmissionRecord,
  LayerId
} from '../types';
import { translations } from '../data/translations';
import { 
  FileText, 
  Plus, 
  Leaf, 
  Droplets, 
  Trees, 
  Home, 
  ShieldAlert, 
  Save, 
  Eye, 
  CheckCircle2, 
  Download, 
  MapPin, 
  Camera, 
  Sparkles, 
  Trash2, 
  ArrowRight,
  Printer,
  FileCheck,
  AlertCircle
} from 'lucide-react';

interface EcoFormsHubProps {
  lang: Language;
  onRecordSubmitted: (record: GeoPointRecord) => void;
  onOpenMapPicker: () => void;
  pickedLat?: number;
  pickedLng?: number;
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
}) => {
  const t = translations[lang];

  // Selected template & view state
  const [activeTemplate, setActiveTemplate] = useState<FormTemplateId>('biodiversity');
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string | null>(null);

  // Form Field States
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
  const [photoUrl, setPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80');

  // Specific Form Template Dynamic Details
  // Biodiversity Template
  const [speciesNameAr, setSpeciesNameAr] = useState<string>('شوح سوري (Abies cilicica)');
  const [speciesCategory, setSpeciesCategory] = useState<string>('flora');
  const [populationCount, setPopulationCount] = useState<number>(120);
  const [biodiversityIndex, setBiodiversityIndex] = useState<number>(85);

  // Water Quality Template
  const [waterBodyType, setWaterBodyType] = useState<string>('spring');
  const [waterPh, setWaterPh] = useState<number>(7.6);
  const [waterSalinityPpm, setWaterSalinityPpm] = useState<number>(320);
  const [dischargeRate, setDischargeRate] = useState<number>(3.5);

  // Soil & Forest Degradation Template
  const [erosionType, setErosionType] = useState<string>('water_runoff');
  const [soilOrganicContent, setSoilOrganicContent] = useState<number>(4.8);
  const [burnedHectares, setBurnedHectares] = useState<number>(0);
  const [replantedSaplings, setReplantedSaplings] = useState<number>(500);

  // Syrian Demographic Eco-Impact Template
  const [householdCount, setHouseholdCount] = useState<number>(450);
  const [primaryFuel, setPrimaryFuel] = useState<string>('solar_hybrid');
  const [wellReliancePercent, setWellReliancePercent] = useState<number>(65);

  // Protected Reserve Incident Template
  const [reserveName, setReserveName] = useState<string>('محمية غابات الفرنلق');
  const [incidentType, setIncidentType] = useState<string>('logging_prevention');
  const [patrolSquadId, setPatrolSquadId] = useState<string>('SQUAD-ALPHA-04');

  // Update Lat/Lng if user picked coordinates on the map
  useEffect(() => {
    if (pickedLat !== undefined && pickedLng !== undefined) {
      setLat(pickedLat);
      setLng(pickedLng);
    }
  }, [pickedLat, pickedLng]);

  // Handle Form Submission
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    let layerId: LayerId = 'biodiversity';
    let metrics: GeoPointRecord['metrics'] = {};

    if (activeTemplate === 'biodiversity') {
      layerId = 'biodiversity';
      metrics = { biodiversityIndex, ambientTempC: 25.0 };
    } else if (activeTemplate === 'water_quality') {
      layerId = 'water_resources';
      metrics = { waterPh, waterSalinityPpm };
    } else if (activeTemplate === 'soil_forest') {
      layerId = 'field_surveys';
      metrics = { soilOrganicContent, ndvi: 0.65 };
    } else if (activeTemplate === 'demographic_impact') {
      layerId = 'air_quality';
      metrics = { airQualityIndex: 45, ambientTempC: 28.0 };
    } else if (activeTemplate === 'protected_area') {
      layerId = 'env_baseline';
      metrics = { biodiversityIndex: 90 };
    }

    const newRecordId = `SY-FORM-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newRecord: GeoPointRecord = {
      id: newRecordId,
      siteNameAr: siteNameAr || (lang === 'ar' ? `استمارة بيئية جديدة - ${newRecordId}` : `New Eco Form Entry - ${newRecordId}`),
      siteNameEn: siteNameEn || `Eco Form Submission ${newRecordId}`,
      governorate,
      lat,
      lng,
      elevation,
      layerId,
      sdgTags: [
        { id: 'sdg-15', code: 'SDG15', labelAr: 'الحياة في البر', labelEn: 'Life on Land', color: '#57B039' },
        { id: 'sdg-13', code: 'SDG13', labelAr: 'العمل المناخي', labelEn: 'Climate Action', color: '#326B32' },
      ],
      verificationStatus: 'verified',
      collectedDate: new Date().toISOString().split('T')[0],
      collectorName: inspectorName,
      collectorTeam: inspectorTeam,
      metrics,
      notesAr: notesAr || (lang === 'ar' ? 'تم تسجيل هذه الاستمارة عبر قسم النماذج المعتمدة لـ TSNEIP.' : 'Registered via TSNEIP Dedicated Eco-Form Templates Hub.'),
      notesEn: notesEn || 'Registered via TSNEIP Dedicated Eco-Form Templates Hub.',
      imageUrl: photoUrl,
      threatLevel,
    };

    onRecordSubmitted(newRecord);

    setSubmitSuccessMsg(
      lang === 'ar' 
        ? `تم إرسال وحفظ الاستمارة الميدانية بنجاح برقم: ${newRecordId}! وتم إدراجها في خريطة المنصة.`
        : `Form submitted and pushed to spatial map successfully with ID: ${newRecordId}!`
    );

    setTimeout(() => {
      setSubmitSuccessMsg(null);
    }, 6000);
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
      notesAr,
      savedAt: new Date().toLocaleString(),
    };
    localStorage.setItem('TSNEIP_FORM_DRAFT', JSON.stringify(draftData));
    alert(lang === 'ar' ? 'تم حفظ مسودة الاستمارة بنجاح على جهازك!' : 'Form draft saved locally!');
  };

  // Export Form PDF / Print
  const handlePrintCertificate = () => {
    window.print();
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
              onClick={handleSaveDraft}
              className="px-3.5 py-2 text-xs bg-white/15 hover:bg-white/25 text-white rounded-lg border border-white/25 font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4 text-emerald-300" />
              <span>{lang === 'ar' ? 'حفظ مسودة' : 'Save Draft'}</span>
            </button>

            <button
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

        {/* Success Alert Banner */}
        {submitSuccessMsg && (
          <div className="bg-emerald-50 border-2 border-emerald-500 text-emerald-900 p-4 rounded-xl shadow-md flex items-center gap-3 animate-fade-in">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div className="text-xs md:text-sm font-bold">{submitSuccessMsg}</div>
          </div>
        )}

        {/* Template Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Template 1 */}
          <button
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

          {/* Template 2 */}
          <button
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

          {/* Template 3 */}
          <button
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

          {/* Template 4 */}
          <button
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

          {/* Template 5 */}
          <button
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

        {/* Form Body or Preview Document */}
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
                {lang === 'ar' ? 'كود النموذج:' : 'Template Code:'} TSNEIP-F-0{activeTemplate === 'biodiversity' ? '1' : activeTemplate === 'water_quality' ? '2' : activeTemplate === 'soil_forest' ? '3' : activeTemplate === 'demographic_impact' ? '4' : '5'}
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
                    className="w-full px-3 py-1.5 text-xs font-coord border border-slate-300 rounded focus:ring-2 focus:ring-[#006BB2]"
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
                    className="w-full px-3 py-1.5 text-xs font-coord border border-slate-300 rounded focus:ring-2 focus:ring-[#006BB2]"
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
                    className="w-full px-3 py-1.5 text-xs font-coord border border-slate-300 rounded focus:ring-2 focus:ring-[#006BB2]"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Specific Template Inputs */}
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
                      className="w-full px-3 py-1.5 text-xs font-coord border border-slate-300 rounded bg-white"
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
                      className="w-full px-3 py-1.5 text-xs font-coord border border-slate-300 rounded bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

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
                      className="w-full px-3 py-1.5 text-xs font-coord border border-slate-300 rounded bg-white"
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
                      className="w-full px-3 py-1.5 text-xs font-coord border border-slate-300 rounded bg-white"
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
                      className="w-full px-3 py-1.5 text-xs font-coord border border-slate-300 rounded bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTemplate === 'soil_forest' && (
              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 space-y-4">
                <h4 className="font-extrabold text-xs text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Trees className="w-4 h-4 text-amber-600" />
                  <span>{lang === 'ar' ? 'مؤشرات التربة والانجراف وإعادة التشجير' : 'Soil Carbon & Afforestation Inputs'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {lang === 'ar' ? 'نوع الانجراف' : 'Erosion Pattern'}
                    </label>
                    <select
                      value={erosionType}
                      onChange={(e) => setErosionType(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white font-semibold"
                    >
                      <option value="water_runoff">{lang === 'ar' ? 'انجراف مائي مطري' : 'Water Runoff'}</option>
                      <option value="wind">{lang === 'ar' ? 'انجراف ريحي صحراوي' : 'Wind Erosion'}</option>
                      <option value="tillage">{lang === 'ar' ? 'تعرية زراعية' : 'Soil Tillage Loss'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {lang === 'ar' ? 'المادة العضوية بالتربة %' : 'Organic Carbon %'}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={soilOrganicContent}
                      onChange={(e) => setSoilOrganicContent(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 text-xs font-coord border border-slate-300 rounded bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {lang === 'ar' ? 'المساحة المحترقة (هكتار)' : 'Burned Area (Ha)'}
                    </label>
                    <input
                      type="number"
                      value={burnedHectares}
                      onChange={(e) => setBurnedHectares(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-3 py-1.5 text-xs font-coord border border-slate-300 rounded bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {lang === 'ar' ? 'عدد الغراس المغروسة' : 'Replanted Saplings'}
                    </label>
                    <input
                      type="number"
                      value={replantedSaplings}
                      onChange={(e) => setReplantedSaplings(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-3 py-1.5 text-xs font-coord border border-slate-300 rounded bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Field Notes & Photo Attachment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'ar' ? 'الملاحظات والتوصيات الميدانية *' : 'Field Inspection Notes & Recommendations *'}
                </label>
                <textarea
                  rows={3}
                  value={notesAr}
                  onChange={(e) => setNotesAr(e.target.value)}
                  placeholder={lang === 'ar' ? 'اكتب ملاحظات الفريق الميداني وتوصيات الصيانة بيئياً...' : 'Field team observations, biodiversity health notes & intervention plans...'}
                  className="w-full p-3 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#006BB2] focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'ar' ? 'صورة التوثيق الميداني (رابط/معاينة)' : 'Field Documentation Photo (URL)'}
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-[#006BB2]"
                  />
                  {photoUrl && (
                    <div className="h-20 rounded-lg overflow-hidden border border-slate-200 relative group">
                      <img src={photoUrl} alt="Field preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold">
                        {lang === 'ar' ? 'معاينة الصورة' : 'Photo Preview'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-xs text-slate-500 font-medium">
                  {lang === 'ar' ? 'سيتم اعتماد الاستمارة فورياً في نظام TSNEIP' : 'Form will be immediately registered into TSNEIP spatial layer'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#009600] hover:bg-[#008000] text-white text-xs md:text-sm font-extrabold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer border border-emerald-400/30"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'حفظ واعتماد الاستمارة بالمنظومة' : 'Submit & Register Eco Form'}</span>
                </button>
              </div>
            </div>

          </form>
        ) : (
          /* PREVIEW CERTIFICATE DOCUMENT WORKSPACE */
          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-[#006BB2]/40 space-y-6 print:p-0 print:border-none">
            
            {/* Certificate Header Banner */}
            <div className="flex items-center justify-between pb-6 border-b-2 border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#009600] to-[#006BB2] text-white flex items-center justify-center shadow-md font-bold text-2xl">
                  SY
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest">
                    REPUBLIC OF SYRIA &mdash; ALTATWEER FOUNDATION
                  </div>
                  <h1 className="text-2xl font-black text-slate-900 font-heading">
                    {lang === 'ar' ? 'وثيقة سجل المسح البيئي والمكاني المعتمَد' : 'Certified Syrian Environmental Field Survey Record'}
                  </h1>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    TSNEIP GIS Platform &bull; Serial No: SY-CERT-2026-8941
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex flex-col items-end text-right">
                <div className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-full uppercase border border-emerald-300">
                  OFFICIALLY VERIFIED
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  Issued: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Document Attributes Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 font-medium">{lang === 'ar' ? 'اسم الموقع:' : 'Site Name:'}</span>
                <div className="font-bold text-slate-900 mt-0.5">{siteNameAr || 'محمية شوح الفرنلق'}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">{lang === 'ar' ? 'المحافظة:' : 'Governorate:'}</span>
                <div className="font-bold text-slate-900 mt-0.5">{governorate}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">{lang === 'ar' ? 'الإحداثيات:' : 'Coordinates:'}</span>
                <div className="font-mono font-bold text-[#006BB2] mt-0.5">{lat}° N, {lng}° E</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">{lang === 'ar' ? 'الفريق المفتش:' : 'Inspection Team:'}</span>
                <div className="font-bold text-slate-900 mt-0.5">{inspectorName}</div>
              </div>
            </div>

            {/* Inspection Details Section */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900 border-b border-slate-200 pb-1">
                {lang === 'ar' ? '1. ملخص القراءات والمؤشرات البيئية' : '1. Environmental Indicators & Metrics Breakdown'}
              </h4>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <span className="text-[10px] text-emerald-800 font-bold uppercase">Biodiversity Index</span>
                  <div className="text-lg font-black text-emerald-900 font-coord">{biodiversityIndex} / 100</div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <span className="text-[10px] text-blue-800 font-bold uppercase">Water Quality pH</span>
                  <div className="text-lg font-black text-blue-900 font-coord">{waterPh} pH</div>
                </div>

                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <span className="text-[10px] text-amber-800 font-bold uppercase">Soil Organic Carbon</span>
                  <div className="text-lg font-black text-amber-900 font-coord">{soilOrganicContent}%</div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-sm text-slate-900 border-b border-slate-200 pb-1">
                {lang === 'ar' ? '2. التوصيات الميدانية المعتمدة' : '2. Official Field Recommendations'}
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                {notesAr || (lang === 'ar' ? 'توصي الاستمارة بتفعيل أجهزة الترقيم والاستشعار عن بعد ومتابعة حالة تجدد الغطاء النباتي.' : 'Recommends active remote sensing tracking and vegetation regeneration monitoring.')}
              </p>
            </div>

            {/* Footer Signatures Bar */}
            <div className="pt-6 border-t border-slate-300 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-900">مؤسسة التطوير البيئي &bull; AlTatweer</div>
                <div className="text-[10px] text-slate-500">منصة البيانات الجغرافية الوطنية (TSNEIP)</div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrintCertificate}
                  className="px-4 py-2 bg-[#006BB2] text-white font-bold rounded-lg shadow-sm hover:bg-[#005794] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'طباعة الوثيقة (PDF)' : 'Print Document (PDF)'}</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
