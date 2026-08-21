import React, { useState, useEffect } from 'react';
import { 
  Language, 
  SyrianGovernorate, 
  GeoPointRecord, 
  SurveyForm,
  FormSubmission,
  FormSubmissionCreatePayload
} from '../types';
import { translations } from '../data/translations';
import { surveysApi } from '../services/api';
import { formSubmissionToGeoPoint } from '../utils/adapters';
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
  Trash2, 
  Printer,
  FileCheck,
  AlertCircle,
  Loader2,
  ListFilter
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

  // Forms from backend
  const [surveyForms, setSurveyForms] = useState<SurveyForm[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string>('');
  const [isLoadingForms, setIsLoadingForms] = useState<boolean>(true);

  // Submissions list from backend
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState<boolean>(false);

  // View mode
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dynamic Form Field State (strictly payload data object)
  const [formData, setFormData] = useState<Record<string, any>>({
    site_name: 'محمية شوح الفرنلق',
    governorate: 'Latakia',
    inspector_name: 'م. طارق الشامي',
    notes: 'تم توثيق الوضع البيئي للمحمية.',
  });

  // Coordinates
  const [lat, setLat] = useState<number>(35.8542);
  const [lng, setLng] = useState<number>(35.9814);

  // Load Forms on Mount
  useEffect(() => {
    setIsLoadingForms(true);
    surveysApi.getActiveForms()
      .then((forms) => {
        if (forms && forms.length > 0) {
          setSurveyForms(forms);
          setSelectedFormId(forms[0].id);
        } else {
          // Provide standard initial schema forms if database is brand new
          const fallbackForms: SurveyForm[] = [
            {
              id: '11111111-1111-1111-1111-111111111111',
              title_ar: 'استمارة مسح التنوع الحيوي والأنواع',
              title_en: 'Biodiversity & Species Survey Form',
              slug: 'biodiversity-species-survey',
              description_ar: 'رصد الغطاء النباتي وتعداد الأنواع الحية المهددة',
              description_en: 'Flora & fauna census and protected habitat assessment',
              version: 1,
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              schema: {
                fields: [
                  { name: 'site_name', label_ar: 'اسم الموقع', label_en: 'Site Name', type: 'text', required: true },
                  { name: 'species_name', label_ar: 'اسم النوع البيولوجي', label_en: 'Species Name', type: 'text', required: true },
                  { name: 'species_category', label_ar: 'التصنيف', label_en: 'Category', type: 'select', options: [
                    { value: 'flora', label_ar: 'نباتي (Flora)', label_en: 'Flora' },
                    { value: 'fauna', label_ar: 'حيواني (Fauna)', label_en: 'Fauna' },
                    { value: 'birds', label_ar: 'طيور (Avian)', label_en: 'Birds' }
                  ]},
                  { name: 'biodiversity_index', label_ar: 'مؤشر الصحة البيئية (0-100)', label_en: 'Bio Health Index', type: 'number', unit: '/100' },
                  { name: 'observed_population', label_ar: 'التعداد التقريبي', label_en: 'Estimated Population', type: 'number' },
                  { name: 'notes', label_ar: 'الملاحظات والتوصيات', label_en: 'Field Notes', type: 'textarea' },
                ]
              }
            },
            {
              id: '22222222-2222-2222-2222-222222222222',
              title_ar: 'استمارة فحص جودة المياه والأحواض الجوفية',
              title_en: 'Water Quality & Aquifer Survey Form',
              slug: 'water-quality-survey',
              description_ar: 'قياس الملوحة وpH وتدفق الينابيع والآبار',
              description_en: 'Salinity TDS, pH level, discharge rate and aquifer monitoring',
              version: 1,
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              schema: {
                fields: [
                  { name: 'site_name', label_ar: 'اسم المصدر المائي', label_en: 'Water Source Name', type: 'text', required: true },
                  { name: 'water_type', label_ar: 'نوع المورد المائي', label_en: 'Water Type', type: 'select', options: [
                    { value: 'spring', label_ar: 'نبع طبيعي', label_en: 'Natural Spring' },
                    { value: 'river', label_ar: 'مجرى نهر', label_en: 'River' },
                    { value: 'well', label_ar: 'بئر جوفي', label_en: 'Groundwater Well' }
                  ]},
                  { name: 'water_ph', label_ar: 'الرقم الهيدروجيني pH', label_en: 'pH Level', type: 'number', unit: 'pH' },
                  { name: 'salinity_ppm', label_ar: 'الملوحة TDS (PPM)', label_en: 'Salinity (PPM)', type: 'number', unit: 'ppm' },
                  { name: 'discharge_rate', label_ar: 'معدل التدفق (م³/ث)', label_en: 'Discharge Rate (m³/s)', type: 'number' },
                  { name: 'notes', label_ar: 'الملاحظات الميدانية', label_en: 'Field Notes', type: 'textarea' },
                ]
              }
            }
          ];
          setSurveyForms(fallbackForms);
          setSelectedFormId(fallbackForms[0].id);
        }
      })
      .catch(() => {
        // Handled fallback above
      })
      .finally(() => setIsLoadingForms(false));

    // Load Submissions
    loadSubmissions();
  }, []);

  const loadSubmissions = () => {
    setIsLoadingSubmissions(true);
    surveysApi.getSubmissions()
      .then((res) => {
        // Check if GeoJSON FeatureCollection or Array
        if (res && res.type === 'FeatureCollection' && Array.isArray(res.features)) {
          const list: FormSubmission[] = res.features.map((f: any) => ({
            id: f.id || f.properties?.id,
            form: f.properties?.form,
            form_title: f.properties?.form_title,
            data: f.properties?.data || {},
            location: f.geometry,
            status: f.properties?.status || 'PENDING',
            submitted_by_username: f.properties?.submitted_by_username,
            created_at: f.properties?.created_at,
          }));
          setSubmissions(list);
        } else if (Array.isArray(res)) {
          setSubmissions(res);
        } else if (res && Array.isArray(res.results)) {
          setSubmissions(res.results);
        }
      })
      .catch(() => {
        // ignore
      })
      .finally(() => setIsLoadingSubmissions(false));
  };

  // Update Lat/Lng when map picker returns new coordinates
  useEffect(() => {
    if (pickedLat !== undefined && pickedLng !== undefined) {
      setLat(pickedLat);
      setLng(pickedLng);
    }
  }, [pickedLat, pickedLng]);

  const activeForm = surveyForms.find(f => f.id === selectedFormId) || surveyForms[0];

  const handleFieldChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Form Submission strictly to Django Backend POST /api/v1/surveys/submissions/
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const payload: FormSubmissionCreatePayload = {
      form: activeForm.id,
      data: {
        ...formData,
        submitted_at: new Date().toISOString(),
      },
      location: {
        type: 'Point',
        coordinates: [lng, lat],
      },
    };

    try {
      const result = await surveysApi.submitForm(payload);
      
      const newGeoPoint = formSubmissionToGeoPoint(result);
      onRecordSubmitted(newGeoPoint);

      setSubmitSuccessMsg(
        lang === 'ar' 
          ? `تم إرسال وحفظ الاستمارة الميدانية في السيرفر بنجاح!` 
          : `Form submitted to TSNEIP backend successfully!`
      );

      loadSubmissions();

      setTimeout(() => {
        setSubmitSuccessMsg(null);
      }, 5000);
    } catch (err: any) {
      const msg = err.data?.detail || err.message || (lang === 'ar' ? 'فشل حفظ الاستمارة' : 'Failed to submit form');
      setErrorMessage(typeof msg === 'string' ? msg : JSON.stringify(msg));

      // Local fallback for standalone mode
      const fallbackSub: FormSubmission = {
        id: `sub-${Date.now()}`,
        form: activeForm.id,
        form_title: lang === 'ar' ? activeForm.title_ar : activeForm.title_en,
        data: payload.data,
        location: payload.location,
        status: 'PENDING',
        created_at: new Date().toISOString(),
      };
      onRecordSubmitted(formSubmissionToGeoPoint(fallbackSub));
      setSubmitSuccessMsg(lang === 'ar' ? 'تم تسجيل الاستمارة وإدراجها في الخريطة.' : 'Form saved to spatial map.');
      setTimeout(() => setSubmitSuccessMsg(null), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem('TSNEIP_FORM_DRAFT', JSON.stringify({
      formId: selectedFormId,
      formData,
      lat,
      lng,
      savedAt: new Date().toISOString(),
    }));
    alert(lang === 'ar' ? 'تم حفظ مسودة الاستمارة محلياً!' : 'Form draft saved locally!');
  };

  return (
    <div className="flex-1 bg-[#E3EAEF] text-[#1E293B] overflow-y-auto p-4 md:p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header Title Banner */}
        <div className="bg-[#006BB2] text-white p-6 rounded-2xl shadow-lg border border-blue-400/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
          <div className="space-y-1 relative z-10">
            <div className="flex items-center gap-2">
              <span className="bg-[#009600] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {lang === 'ar' ? 'نماذج استبيانات ديناميكية (Surveys API)' : 'Dynamic Surveys Hub'}
              </span>
              <span className="text-blue-200 text-xs font-mono">POST /api/v1/surveys/submissions/</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black font-heading tracking-tight text-white">
              {lang === 'ar' ? 'مركز استمارات رصد البيانات البيئية والميدانية' : 'Eco & Field Surveys Hub'}
            </h2>
            <p className="text-xs md:text-sm text-blue-100/90 font-medium max-w-2xl">
              {lang === 'ar'
                ? 'استمارات متوافقة مباشرة مع نماذج JSON Schema في قاعدة بيانات الباك إند لرصد المياه والتربة والغابات والتنوع الحيوي.'
                : 'Dynamic JSON Schema-driven forms for field survey data collection directly integrated with Django backend.'}
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
              <span>{isPreviewMode ? (lang === 'ar' ? 'تعديل الاستمارة' : 'Edit Form') : (lang === 'ar' ? 'معاينة الوثيقة' : 'Preview Document')}</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-50 border-2 border-rose-400 text-rose-900 p-4 rounded-xl shadow-md flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
            <div className="text-xs md:text-sm font-bold">{errorMessage}</div>
          </div>
        )}

        {/* Success Alert Banner */}
        {submitSuccessMsg && (
          <div className="bg-emerald-50 border-2 border-emerald-500 text-emerald-900 p-4 rounded-xl shadow-md flex items-center gap-3">
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

        {/* Form Template Selector (Loaded dynamically from Django backend SurveyForm model) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>{lang === 'ar' ? 'اختر نموذج الاستمارة المعتمد من السيرفر:' : 'Select Backend Survey Form:'}</span>
            {isLoadingForms && <Loader2 className="w-4 h-4 animate-spin text-[#006BB2]" />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {surveyForms.map((form) => {
              const isSelected = form.id === selectedFormId;
              return (
                <button
                  key={form.id}
                  type="button"
                  onClick={() => setSelectedFormId(form.id)}
                  className={`p-4 rounded-xl border text-right rtl:text-right ltr:text-left transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-xs ${
                    isSelected
                      ? 'bg-white border-[#009600] ring-2 ring-[#009600]/30 shadow-md'
                      : 'bg-white/80 hover:bg-white border-[#D1DCE5] text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded">
                      v{form.version}
                    </span>
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-slate-900 leading-snug">
                      {lang === 'ar' ? form.title_ar : form.title_en}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                      {lang === 'ar' ? form.description_ar : form.description_en}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Body or Document Preview */}
        {!isPreviewMode && activeForm ? (
          <form onSubmit={handleSubmitForm} className="bg-white rounded-2xl p-6 shadow-md border border-[#D1DCE5] space-y-6">
            
            {/* Form Section Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#006BB2] text-white flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">
                    {lang === 'ar' ? activeForm.title_ar : activeForm.title_en}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'ar' ? activeForm.description_ar : activeForm.description_en}
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Slug: {activeForm.slug}
              </div>
            </div>

            {/* Spatial Coordinates Box (GeoJSON Point Location for Backend) */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#006BB2]" />
                  <span>{lang === 'ar' ? 'موقع المسح الجغرافي (GeoJSON Point Location)' : 'Spatial Location (GeoJSON Point)'}</span>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    {lang === 'ar' ? 'خط العرض (Latitude N)' : 'Latitude (°N)'}
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    min="-90"
                    max="90"
                    required
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
                    step="0.000001"
                    min="-180"
                    max="180"
                    required
                    value={lng}
                    onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded focus:ring-2 focus:ring-[#006BB2]"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Fields Driven by Schema from Backend */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                {lang === 'ar' ? 'حقول النموذج الديناميكية (Form Schema Fields):' : 'Dynamic Schema Fields:'}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeForm.schema?.fields?.map((field) => {
                  const fieldLabel = lang === 'ar' ? field.label_ar : field.label_en;
                  const val = formData[field.name] !== undefined ? formData[field.name] : '';

                  if (field.type === 'select' && field.options) {
                    return (
                      <div key={field.name}>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {fieldLabel} {field.required && '*'}
                        </label>
                        <select
                          required={field.required}
                          value={val}
                          onChange={(e) => handleFieldChange(field.name, e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#006BB2] bg-white font-medium"
                        >
                          <option value="">{lang === 'ar' ? '-- اختر --' : '-- Select --'}</option>
                          {field.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {lang === 'ar' ? opt.label_ar : opt.label_en}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }

                  if (field.type === 'textarea') {
                    return (
                      <div key={field.name} className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {fieldLabel} {field.required && '*'}
                        </label>
                        <textarea
                          rows={3}
                          required={field.required}
                          value={val}
                          onChange={(e) => handleFieldChange(field.name, e.target.value)}
                          placeholder={fieldLabel}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#006BB2]"
                        />
                      </div>
                    );
                  }

                  return (
                    <div key={field.name}>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                        <span>{fieldLabel} {field.required && '*'}</span>
                        {field.unit && <span className="text-[10px] text-slate-400 font-mono">({field.unit})</span>}
                      </label>
                      <input
                        type={field.type === 'number' ? 'number' : 'text'}
                        step={field.type === 'number' ? 'any' : undefined}
                        required={field.required}
                        value={val}
                        onChange={(e) => handleFieldChange(
                          field.name, 
                          field.type === 'number' ? (e.target.value === '' ? '' : parseFloat(e.target.value)) : e.target.value
                        )}
                        placeholder={fieldLabel}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#006BB2]"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="text-xs text-slate-500 font-mono">
                POST /api/v1/surveys/submissions/
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#009600] hover:bg-[#008000] text-white text-xs md:text-sm font-extrabold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer border border-emerald-400/30 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4" />}
                  <span>{lang === 'ar' ? 'إرسال الاستمارة للباك إند' : 'Submit Form to Backend'}</span>
                </button>
              </div>
            </div>

          </form>
        ) : isPreviewMode ? (
          /* Document Preview */
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-300 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b-2 border-slate-800">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">
                  {lang === 'ar' ? activeForm?.title_ar : activeForm?.title_en}
                </h1>
                <p className="text-xs text-slate-500 font-mono">
                  TSNEIP Survey Submission Document &bull; Form ID: {activeForm?.id}
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{lang === 'ar' ? 'طباعة' : 'Print'}</span>
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs grid grid-cols-2 gap-4 font-mono">
              <div>
                <span className="text-slate-500">Coordinates:</span>
                <div className="font-bold text-[#006BB2]">{lat}° N, {lng}° E</div>
              </div>
              <div>
                <span className="text-slate-500">Timestamp:</span>
                <div className="font-bold text-slate-800">{new Date().toLocaleString()}</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase text-slate-700">Submitted Field Data:</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(formData).map(([k, v]) => (
                  <div key={k} className="p-2.5 bg-white border border-slate-200 rounded">
                    <span className="text-[10px] text-slate-400 block font-mono">{k}</span>
                    <span className="font-bold text-slate-800">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {/* Recent Backend Submissions Table */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#D1DCE5] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <ListFilter className="w-4 h-4 text-[#006BB2]" />
              <span>{lang === 'ar' ? 'الاستمارات المسجلة بالباك إند (GET /api/v1/surveys/submissions/)' : 'Live Submissions from Backend API'}</span>
            </h3>
            <button
              onClick={loadSubmissions}
              className="text-xs text-[#006BB2] hover:underline font-bold"
            >
              {lang === 'ar' ? 'تحديث السجلات' : 'Refresh List'}
            </button>
          </div>

          {isLoadingSubmissions ? (
            <div className="p-8 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#006BB2]" />
              <span>{lang === 'ar' ? 'جارٍ تحميل السجلات...' : 'Loading submissions...'}</span>
            </div>
          ) : submissions.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              {lang === 'ar' ? 'لا توجد استمارات مسجلة حالياً في قاعدة البيانات.' : 'No submissions recorded yet in backend.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left rtl:text-right border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <th className="p-2.5 font-bold">ID</th>
                    <th className="p-2.5 font-bold">{lang === 'ar' ? 'الاستمارة' : 'Form'}</th>
                    <th className="p-2.5 font-bold">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                    <th className="p-2.5 font-bold">{lang === 'ar' ? 'الإحداثيات' : 'Coordinates'}</th>
                    <th className="p-2.5 font-bold">{lang === 'ar' ? 'تاريخ التسجيل' : 'Date'}</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => {
                    const coords = sub.location?.coordinates;
                    return (
                      <tr key={sub.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-2.5 font-mono text-[11px] text-slate-500">{sub.id.slice(0, 8)}...</td>
                        <td className="p-2.5 font-semibold text-slate-800">{sub.form_title || sub.form}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            sub.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="p-2.5 font-coord text-slate-600">
                          {coords ? `${coords[1].toFixed(3)}°N, ${coords[0].toFixed(3)}°E` : '-'}
                        </td>
                        <td className="p-2.5 text-slate-500 font-coord">
                          {sub.created_at ? sub.created_at.split('T')[0] : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};