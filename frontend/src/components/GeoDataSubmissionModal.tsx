import React, { useState, useEffect } from 'react';
import { 
  Language, 
  Observation, 
  SpatialLayerConfig, 
  SyrianGovernorate, 
  LayerId,
  VerificationStatus,
  SdgTag 
} from '../types';
import { translations } from '../data/translations';
import { SDG_TAGS } from '../data/mockData';
import { 
  X, 
  MapPin, 
  Crosshair, 
  Plus, 
  CheckCircle2
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

  const [siteNameAr, setSiteNameAr] = useState<string>('');
  const [siteNameEn, setSiteNameEn] = useState<string>('');
  const [governorate, setGovernorate] = useState<SyrianGovernorate>('Damascus');
  const [lat, setLat] = useState<string>(pickedLat ? pickedLat.toString() : '33.5138');
  const [lng, setLng] = useState<string>(pickedLng ? pickedLng.toString() : '36.2765');
  const [elevation, setElevation] = useState<string>('450');
  const [layerId, setLayerId] = useState<string>('env_baseline');
  const [selectedSdgCodes, setSelectedSdgCodes] = useState<string[]>(['SDG15', 'SDG6']);
  const [threatLevel, setThreatLevel] = useState<'low' | 'moderate' | 'high' | 'critical'>('moderate');
  const [collectorName, setCollectorName] = useState<string>('م. طارق الشامي');
  const [collectorTeam, setCollectorTeam] = useState<string>('فريق مسح النظم الجغرافية - دمشق');
  const [notesAr, setNotesAr] = useState<string>('');
  const [notesEn, setNotesEn] = useState<string>('');
  
  // Metrics
  const [ndvi, setNdvi] = useState<string>('0.75');
  const [waterPh, setWaterPh] = useState<string>('7.4');
  const [salinity, setSalinity] = useState<string>('320');
  const [biodiversityIndex, setBiodiversityIndex] = useState<string>('85');

  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Sync picked coordinates if changed
  useEffect(() => {
    if (pickedLat) setLat(pickedLat.toFixed(5));
    if (pickedLng) setLng(pickedLng.toFixed(5));
  }, [pickedLat, pickedLng]);

  if (!isOpen) return null;

  const toggleSdg = (code: string) => {
    setSelectedSdgCodes(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedSdgs: SdgTag[] = selectedSdgCodes
      .map(code => SDG_TAGS[code])
      .filter(Boolean);

    const parsedLat = parseFloat(lat) || 33.5138;
    const parsedLng = parseFloat(lng) || 36.2765;

    const newRecord: Observation = {
      record_code: `SY-ENV-2026-${Math.floor(100 + Math.random() * 900)}`,
      site_name_ar: siteNameAr || (lang === 'ar' ? 'موقع مسح ميداني جديد' : 'New Survey Site'),
      site_name_en: siteNameEn || 'New Survey Site',
      governorate,
      location: {
        type: 'Point',
        coordinates: [parsedLng, parsedLat], // PostGIS GeoJSON Format [longitude, latitude]
      },
      elevation: parseFloat(elevation) || 450,
      layer_id: layerId,
      sdg_tags: selectedSdgs.length > 0 ? selectedSdgs : [SDG_TAGS.SDG15],
      status: 'pending',
      collected_date: new Date().toISOString().split('T')[0],
      collector_name: collectorName || 'باحث ميداني',
      collector_team: collectorTeam || 'فريق TSNEIP الوطنية',
      metrics: {
        ndvi: ndvi ? parseFloat(ndvi) : undefined,
        water_ph: waterPh ? parseFloat(waterPh) : undefined,
        water_salinity_ppm: salinity ? parseFloat(salinity) : undefined,
        biodiversity_index: biodiversityIndex ? parseFloat(biodiversityIndex) : undefined,
      },
      notes_ar: notesAr || 'تم توثيق البيانات الميدانية عبر البوابة الجغرافية الوطنية.',
      notes_en: notesEn || 'Field observations committed to TSNEIP national database.',
      image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
      threat_level: threatLevel,
    };

    onSubmitRecord(newRecord);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1200);
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
              <h3 className="font-extrabold text-base font-heading">{t.modalTitle}</h3>
              <p className="text-xs text-blue-100">{t.modalSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {showSuccess ? (
          <div className="p-8 text-center space-y-3 bg-emerald-50">
            <CheckCircle2 className="w-12 h-12 text-[#009600] mx-auto animate-bounce" />
            <h4 className="text-lg font-extrabold text-[#009600]">{t.successSubmitted}</h4>
            <p className="text-xs text-slate-600">
              {lang === 'ar' ? 'جارٍ تفعيل النقطة على الخريطة والجدول...' : 'Updating spatial map and database registry...'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
            
            {/* Location & Site Name Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.fieldSiteAr} *
                </label>
                <input
                  type="text"
                  required
                  value={siteNameAr}
                  onChange={(e) => setSiteNameAr(e.target.value)}
                  placeholder="مثال: محمية نبع الفيجة - وادي بردى"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-[#D1DCE5] rounded-md focus:bg-white focus:ring-2 focus:ring-[#006BB2] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.fieldSiteEn}
                </label>
                <input
                  type="text"
                  value={siteNameEn}
                  onChange={(e) => setSiteNameEn(e.target.value)}
                  placeholder="e.g. Ain Fijah Basin Reserve"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-[#D1DCE5] rounded-md focus:bg-white focus:ring-2 focus:ring-[#006BB2] focus:outline-none"
                />
              </div>
            </div>

            {/* Governorate & Layer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.fieldGov} *
                </label>
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value as SyrianGovernorate)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-[#D1DCE5] rounded-md focus:bg-white focus:ring-2 focus:ring-[#006BB2] focus:outline-none"
                >
                  {GOVERNORATES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.fieldLayer} *
                </label>
                <select
                  value={layerId}
                  onChange={(e) => setLayerId(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-[#D1DCE5] rounded-md focus:bg-white focus:ring-2 focus:ring-[#006BB2] focus:outline-none"
                >
                  {layers.map((l) => (
                    <option key={l.id} value={l.id}>
                      {lang === 'ar' ? l.titleAr : l.titleEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Coordinates Fields + Map Picker */}
            <div className="bg-slate-50 p-3 rounded-lg border border-[#D1DCE5] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-[#009600]" />
                  <span>{t.coordinates} (WGS84 EPSG:4326)</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onActivateMapPickMode();
                  }}
                  className="px-2.5 py-1 text-[11px] bg-emerald-50 text-[#009600] border border-emerald-300 hover:bg-emerald-100 rounded font-bold flex items-center gap-1 transition-colors"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>{t.pickLocationMap}</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">{t.fieldLat}</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-coord bg-white border border-[#D1DCE5] rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">{t.fieldLong}</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-coord bg-white border border-[#D1DCE5] rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">{t.fieldElev}</label>
                  <input
                    type="number"
                    value={elevation}
                    onChange={(e) => setElevation(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-coord bg-white border border-[#D1DCE5] rounded focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SDG Target Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.fieldSdgs}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {Object.values(SDG_TAGS).map((sdg) => {
                  const isChecked = selectedSdgCodes.includes(sdg.code);
                  return (
                    <button
                      key={sdg.id || sdg.code}
                      type="button"
                      onClick={() => toggleSdg(sdg.code)}
                      className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                        isChecked 
                          ? 'text-white shadow-xs' 
                          : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                      }`}
                      style={{
                        backgroundColor: isChecked ? sdg.color : undefined,
                        borderColor: isChecked ? sdg.color : undefined,
                      }}
                    >
                      <span>{sdg.code}</span>
                      <span className="text-[10px] font-normal opacity-90">
                        ({lang === 'ar' ? (sdg.label_ar || sdg.labelAr || '').split(':')[1] || (sdg.label_ar || sdg.labelAr) : sdg.code})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Environmental Metrics */}
            <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100 space-y-2">
              <span className="text-xs font-bold text-emerald-900 block mb-1">
                {t.environmentalMetrics}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600">{t.vegetationIndex}</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={ndvi}
                    onChange={(e) => setNdvi(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-coord bg-white border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600">{t.waterPh}</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="14"
                    value={waterPh}
                    onChange={(e) => setWaterPh(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-coord bg-white border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600">{t.salinity}</label>
                  <input
                    type="number"
                    value={salinity}
                    onChange={(e) => setSalinity(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-coord bg-white border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600">{t.biodiversityIndex}</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={biodiversityIndex}
                    onChange={(e) => setBiodiversityIndex(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-coord bg-white border border-slate-300 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.fieldNotesAr}
              </label>
              <textarea
                rows={2}
                value={notesAr}
                onChange={(e) => setNotesAr(e.target.value)}
                placeholder="ملاحظات المسح الميداني والحالة العامة للمحمية أو النهر..."
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-[#D1DCE5] rounded-md focus:bg-white focus:ring-2 focus:ring-[#006BB2] focus:outline-none"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs bg-[#009600] hover:bg-[#008000] text-white rounded-md font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t.submitRecord}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};