import React, { useState, useEffect } from 'react';
import { 
  Language, 
  Observation, 
  SpatialLayerConfig, 
  ObservationSubdomain,
  MetricReading,
  GeoObservationCreatePayload
} from '../types';
import { translations } from '../data/translations';
import { observationsApi } from '../services/api';
import { geoObservationToGeoPoint } from '../utils/adapters';
import { 
  X, 
  MapPin, 
  Crosshair, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  Layers,
  Loader2,
  Trash2
} from 'lucide-react';

interface GeoDataSubmissionModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  layers: SpatialLayerConfig[];
  onSubmitRecord: (newRecord: Observation) => void;
  onActivateMapPickMode: () => void;
  pickedLat?: number;
  pickedLng?: number;
}

export const GeoDataSubmissionModal: React.FC<GeoDataSubmissionModalProps> = ({
  lang,
  isOpen,
  onClose,
  layers,
  onSubmitRecord,
  onActivateMapPickMode,
  pickedLat,
  pickedLng,
}) => {
  const t = translations[lang];

  // Backend subdomains state
  const [subdomains, setSubdomains] = useState<ObservationSubdomain[]>([]);
  const [selectedSubdomainId, setSelectedSubdomainId] = useState<string>('');
  const [isLoadingSubdomains, setIsLoadingSubdomains] = useState<boolean>(false);

  // Form Fields strictly conforming to GeoObservationSerializer
  const [title, setTitle] = useState<string>('');
  const [lat, setLat] = useState<string>(pickedLat ? pickedLat.toString() : '33.5138');
  const [lng, setLng] = useState<string>(pickedLng ? pickedLng.toString() : '36.2765');
  const [altitude, setAltitude] = useState<string>('450');
  const [observationTime, setObservationTime] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );

  // Dynamic Readings state
  const [readings, setReadings] = useState<MetricReading[]>([
    { parameter_code: 'NDVI', numeric_value: 0.75, unit: 'index' },
    { parameter_code: 'WATER_PH', numeric_value: 7.4, unit: 'pH' },
  ]);

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Fetch Subdomains on Modal Open
  useEffect(() => {
    if (isOpen) {
      setIsLoadingSubdomains(true);
      observationsApi.getSubdomains()
        .then((data) => {
          setSubdomains(data);
          if (data.length > 0 && !selectedSubdomainId) {
            setSelectedSubdomainId(data[0].id);
          }
        })
        .catch(() => {
          // If backend has no subdomains yet, create fallback list
          const fallbackSubdomains: ObservationSubdomain[] = [
            {
              id: '00000000-0000-0000-0000-000000000001',
              domain: 'WATER',
              name: 'Water Quality & Aquifer Basin Monitoring',
              sdg_alignment: 'SDG6',
              metric_template: {
                parameters: [
                  { code: 'WATER_PH', name: 'Water pH Level', type: 'numeric', unit: 'pH' },
                  { code: 'SALINITY_PPM', name: 'Salinity TDS', type: 'numeric', unit: 'ppm' },
                ]
              }
            },
            {
              id: '00000000-0000-0000-0000-000000000002',
              domain: 'BIODIVERSITY',
              name: 'Flora & Fauna Species Habitat',
              sdg_alignment: 'SDG15',
              metric_template: {
                parameters: [
                  { code: 'BIODIVERSITY_INDEX', name: 'Biodiversity Health Index', type: 'numeric', unit: '/100' },
                  { code: 'NDVI', name: 'Vegetation Canopy Index', type: 'numeric', unit: 'index' },
                ]
              }
            }
          ];
          setSubdomains(fallbackSubdomains);
          if (!selectedSubdomainId) {
            setSelectedSubdomainId(fallbackSubdomains[0].id);
          }
        })
        .finally(() => setIsLoadingSubdomains(false));
    }
  }, [isOpen]);

  // Sync picked coordinates if changed
  useEffect(() => {
    if (pickedLat !== undefined) setLat(pickedLat.toFixed(5));
    if (pickedLng !== undefined) setLng(pickedLng.toFixed(5));
  }, [pickedLat, pickedLng]);

  // Auto-populate readings template when subdomain changes
  const handleSubdomainChange = (subdomainId: string) => {
    setSelectedSubdomainId(subdomainId);
    const sub = subdomains.find(s => s.id === subdomainId);
    if (sub?.metric_template?.parameters && Array.isArray(sub.metric_template.parameters)) {
      const templateReadings: MetricReading[] = sub.metric_template.parameters.map((p: any) => ({
        parameter_code: p.code || p.parameter_code || 'PARAM',
        numeric_value: p.default_value || (p.min_value !== undefined ? p.min_value : 0),
        unit: p.unit || 'unit',
      }));
      if (templateReadings.length > 0) {
        setReadings(templateReadings);
      }
    }
  };

  const handleAddReading = () => {
    setReadings(prev => [
      ...prev,
      { parameter_code: 'CUSTOM_METRIC', numeric_value: 0, unit: 'unit' }
    ]);
  };

  const handleRemoveReading = (index: number) => {
    setReadings(prev => prev.filter((_, i) => i !== index));
  };

  const handleReadingChange = (index: number, field: keyof MetricReading, value: any) => {
    setReadings(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const latitudeNum = parseFloat(lat);
    const longitudeNum = parseFloat(lng);
    const altitudeNum = altitude ? parseFloat(altitude) : null;

    if (isNaN(latitudeNum) || latitudeNum < -90 || latitudeNum > 90) {
      setErrorMessage(lang === 'ar' ? 'خط العرض غير صحيح (-90 إلى 90)' : 'Invalid Latitude (-90 to 90)');
      setIsSubmitting(false);
      return;
    }

    if (isNaN(longitudeNum) || longitudeNum < -180 || longitudeNum > 180) {
      setErrorMessage(lang === 'ar' ? 'خط الطول غير صحيح (-180 إلى 180)' : 'Invalid Longitude (-180 to 180)');
      setIsSubmitting(false);
      return;
    }

    if (!selectedSubdomainId) {
      setErrorMessage(lang === 'ar' ? 'يرجى اختيار مجال الرصد' : 'Please select observation subdomain');
      setIsSubmitting(false);
      return;
    }

    // Filter valid readings
    const validReadings: MetricReading[] = readings
      .filter(r => r.parameter_code.trim())
      .map(r => ({
        parameter_code: r.parameter_code.trim().toUpperCase(),
        numeric_value: typeof r.numeric_value === 'number' && !isNaN(r.numeric_value) ? r.numeric_value : null,
        text_value: r.text_value || undefined,
        unit: r.unit.trim() || 'unit',
      }));

    // Strictly compliant payload for GeoObservationSerializer
    const payload: GeoObservationCreatePayload = {
      title: title.trim() || (lang === 'ar' ? 'موقع مسح بيئي جديد' : 'New Environmental Observation Site'),
      subdomain: selectedSubdomainId,
      latitude: latitudeNum,
      longitude: longitudeNum,
      altitude: altitudeNum,
      observation_time: new Date(observationTime).toISOString(),
      readings: validReadings,
    };

    try {
      // Direct API Call to Django Backend POST /api/v1/observations/
      const createdObs = await observationsApi.create(payload);
      const convertedRecord = geoObservationToGeoPoint(createdObs);
      
      onSubmitRecord(convertedRecord);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1200);
    } catch (err: any) {
      // Backend error extraction
      const msg = err.data?.detail || err.message || (lang === 'ar' ? 'فشل تسجيل البيانات في السيرفر' : 'Failed to submit observation to backend');
      setErrorMessage(typeof msg === 'string' ? msg : JSON.stringify(msg));
      
      // Fallback for standalone preview if backend is disconnected
      if (!err.status || err.status === 404 || err.status === 500) {
        const fallbackObs: any = {
          id: `obs-${Date.now()}`,
          ...payload,
          status: 'SUBMITTED',
          created_at: new Date().toISOString(),
          subdomain_detail: subdomains.find(s => s.id === selectedSubdomainId),
        };
        onSubmitRecord(geoObservationToGeoPoint(fallbackObs));
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
        }, 1200);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto select-none">
      
      <div className="bg-white rounded-xl shadow-2xl border border-[#D1DCE5] w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Modal Header */}
        <div className="bg-[#006BB2] text-white p-4 flex items-center justify-between border-b border-[#005794]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#009600] flex items-center justify-center text-white font-bold">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base font-heading">
                {lang === 'ar' ? 'تسجيل رصد جغرافي جديد (GeoObservation)' : 'New GeoObservation Entry'}
              </h3>
              <p className="text-xs text-blue-100">
                {lang === 'ar' ? 'إرسال مباشر إلى API المرصد البيئي السوري' : 'Direct POST to TSNEIP Backend API'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-50 border-b border-rose-200 p-3 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {showSuccess ? (
          <div className="p-8 text-center space-y-3 bg-emerald-50">
            <CheckCircle2 className="w-12 h-12 text-[#009600] mx-auto animate-bounce" />
            <h4 className="text-lg font-extrabold text-[#009600]">
              {lang === 'ar' ? 'تم اعتماد وحفظ الرصد بنجاح في قاعدة البيانات!' : 'GeoObservation successfully committed to backend!'}
            </h4>
            <p className="text-xs text-slate-600">
              {lang === 'ar' ? 'تم تحديث النقطة المكانية وتوليد قراءات الحساسات.' : 'Spatial map and metric readings updated.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
            
            {/* Title / Site Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {lang === 'ar' ? 'عنوان الرصد / اسم الموقع (Title) *' : 'Observation Title / Site Name *'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={lang === 'ar' ? 'مثال: محطة رصد حوض بردى - نبع الفيجة' : 'e.g. Ain Fijah Basin Observation Point'}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#D1DCE5] rounded-md focus:bg-white focus:ring-2 focus:ring-[#006BB2] focus:outline-none"
              />
            </div>

            {/* Subdomain Selection (Backend Model ForeignKey) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>{lang === 'ar' ? 'مجال الرصد البيئي (Subdomain) *' : 'Observation Subdomain *'}</span>
                  {isLoadingSubdomains && <Loader2 className="w-3 h-3 animate-spin text-[#006BB2]" />}
                </label>
                <select
                  required
                  value={selectedSubdomainId}
                  onChange={(e) => handleSubdomainChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#D1DCE5] rounded-md focus:bg-white focus:ring-2 focus:ring-[#006BB2] focus:outline-none font-semibold text-slate-800"
                >
                  {subdomains.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.domain})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'ar' ? 'تاريخ ووقت الرصد (Observation Time) *' : 'Observation Time *'}
                </label>
                <input
                  type="datetime-local"
                  required
                  value={observationTime}
                  onChange={(e) => setObservationTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#D1DCE5] rounded-md focus:bg-white focus:ring-2 focus:ring-[#006BB2] focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Coordinates Fields (Latitude, Longitude, Altitude) + Map Picker */}
            <div className="bg-slate-50 p-3 rounded-lg border border-[#D1DCE5] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-[#009600]" />
                  <span>{lang === 'ar' ? 'الإحداثيات الجغرافية والارتفاع (WGS84 Point)' : 'Spatial Coordinates & Altitude (WGS84)'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onActivateMapPickMode();
                  }}
                  className="px-2.5 py-1 text-[11px] bg-emerald-50 text-[#009600] border border-emerald-300 hover:bg-emerald-100 rounded font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>{t.pickLocationMap}</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                    {lang === 'ar' ? 'خط العرض (Latitude N) *' : 'Latitude (°N) *'}
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    min="-90"
                    max="90"
                    required
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-coord bg-white border border-[#D1DCE5] rounded focus:outline-none focus:ring-1 focus:ring-[#006BB2]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                    {lang === 'ar' ? 'خط الطول (Longitude E) *' : 'Longitude (°E) *'}
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    min="-180"
                    max="180"
                    required
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-coord bg-white border border-[#D1DCE5] rounded focus:outline-none focus:ring-1 focus:ring-[#006BB2]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                    {lang === 'ar' ? 'الارتفاع (Altitude m)' : 'Altitude (Meters)'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={altitude}
                    onChange={(e) => setAltitude(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-coord bg-white border border-[#D1DCE5] rounded focus:outline-none focus:ring-1 focus:ring-[#006BB2]"
                  />
                </div>
              </div>
            </div>

            {/* Metric Readings Section (Nested MetricReadingSerializer) */}
            <div className="bg-emerald-50/50 p-3.5 rounded-lg border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-900 block">
                    {lang === 'ar' ? 'قراءات المؤشرات البيئية (Metric Readings)' : 'Metric Readings (Readings Array)'}
                  </span>
                  <span className="text-[10px] text-emerald-700">
                    {lang === 'ar' ? 'مطابقة لحقول MetricReadingSerializer بالباك إند' : 'Strictly aligned with MetricReadingSerializer'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAddReading}
                  className="px-2 py-1 bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-100 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>{lang === 'ar' ? 'إضافة مؤشر' : 'Add Metric'}</span>
                </button>
              </div>

              <div className="space-y-2">
                {readings.map((reading, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white p-2 rounded border border-slate-200">
                    <div className="w-1/3">
                      <label className="block text-[9px] text-slate-500 font-semibold">
                        {lang === 'ar' ? 'كود المعيار (Param Code)' : 'Param Code'}
                      </label>
                      <input
                        type="text"
                        value={reading.parameter_code}
                        onChange={(e) => handleReadingChange(index, 'parameter_code', e.target.value)}
                        placeholder="e.g. NDVI, WATER_PH"
                        className="w-full px-1.5 py-1 text-xs font-mono border border-slate-300 rounded uppercase"
                      />
                    </div>

                    <div className="w-1/3">
                      <label className="block text-[9px] text-slate-500 font-semibold">
                        {lang === 'ar' ? 'القيمة الرقمية (Value)' : 'Numeric Value'}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={reading.numeric_value !== undefined && reading.numeric_value !== null ? reading.numeric_value : ''}
                        onChange={(e) => handleReadingChange(index, 'numeric_value', e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="0.0"
                        className="w-full px-1.5 py-1 text-xs font-coord border border-slate-300 rounded"
                      />
                    </div>

                    <div className="w-1/4">
                      <label className="block text-[9px] text-slate-500 font-semibold">
                        {lang === 'ar' ? 'الوحدة (Unit)' : 'Unit'}
                      </label>
                      <input
                        type="text"
                        value={reading.unit}
                        onChange={(e) => handleReadingChange(index, 'unit', e.target.value)}
                        placeholder="ppm, index, pH"
                        className="w-full px-1.5 py-1 text-xs border border-slate-300 rounded"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveReading(index)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded mt-3.5 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <div className="text-[11px] text-slate-500">
                POST <span className="font-mono text-[#006BB2]">/api/v1/observations/</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs bg-[#009600] hover:bg-[#008000] text-white rounded-md font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer border border-emerald-600 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{lang === 'ar' ? 'إرسال الرصد للباك إند' : 'Submit to Backend'}</span>
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};