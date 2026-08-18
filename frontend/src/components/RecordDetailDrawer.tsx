import React from 'react';
import { 
  Language, 
  GeoPointRecord, 
  SpatialLayerConfig 
} from '../types';
import { translations } from '../data/translations';
import { 
  X, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  User, 
  Calendar, 
  Download, 
  Share2, 
  Globe, 
  ShieldCheck, 
  FileText,
  Compass,
  Thermometer,
  Droplets,
  Leaf,
  Wind
} from 'lucide-react';

interface RecordDetailDrawerProps {
  lang: Language;
  record: GeoPointRecord | null;
  onClose: () => void;
  layers: SpatialLayerConfig[];
  onExportGeoJsonRecord: (record: GeoPointRecord) => void;
}

export const RecordDetailDrawer: React.FC<RecordDetailDrawerProps> = ({
  lang,
  record,
  onClose,
  layers,
  onExportGeoJsonRecord,
}) => {
  const t = translations[lang];

  if (!record) return null;

  const activeLayer = layers.find(l => l.id === record.layerId);
  const layerTitle = activeLayer 
    ? (lang === 'ar' ? activeLayer.titleAr : activeLayer.titleEn) 
    : record.layerId;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-end p-0 sm:p-4 select-none">
      
      <div className="bg-white h-full sm:h-auto sm:max-h-[92vh] w-full max-w-lg sm:rounded-xl shadow-2xl border border-[#D1DCE5] flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        
        {/* Header Bar */}
        <div className="bg-[#006BB2] text-white p-4 flex items-center justify-between border-b border-[#005794]">
          <div className="flex items-center gap-2">
            <span className="bg-[#009600] text-white text-xs font-mono font-bold px-2 py-0.5 rounded">
              {record.id}
            </span>
            <span className="text-xs text-blue-100 uppercase font-semibold">{record.governorate}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          
          {/* Main Title & Verification Status */}
          <div className="space-y-1.5 border-b border-slate-200 pb-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-extrabold text-slate-900 font-heading leading-snug">
                {lang === 'ar' ? record.siteNameAr : record.siteNameEn}
              </h3>
              <span className="shrink-0">
                {record.verificationStatus === 'verified' ? (
                  <span className="bg-emerald-100 text-[#009600] border border-emerald-300 px-2.5 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t.statusVerified}</span>
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t.statusPending}</span>
                  </span>
                )}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {lang === 'ar' ? record.siteNameEn : record.siteNameAr}
            </p>
          </div>

          {/* Photo Preview if available */}
          {record.imageUrl && (
            <div className="relative rounded-lg overflow-hidden border border-[#D1DCE5] max-h-48 group">
              <img 
                src={record.imageUrl} 
                alt={record.siteNameEn} 
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-2 left-2 rtl:left-auto rtl:right-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded font-coord">
                📍 {record.lat.toFixed(4)}° N, {record.lng.toFixed(4)}° E
              </div>
            </div>
          )}

          {/* Coordinates HUD Box */}
          <div className="bg-slate-50 p-3 rounded-lg border border-[#D1DCE5] space-y-1 font-coord text-xs text-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">{t.fieldLat}:</span>
              <span className="font-bold text-slate-900">{record.lat}° N</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">{t.fieldLong}:</span>
              <span className="font-bold text-slate-900">{record.lng}° E</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">{t.fieldElev}:</span>
              <span className="font-bold text-emerald-700">{record.elevation} m</span>
            </div>
          </div>

          {/* Spatial Layer & SDG Tags */}
          <div className="space-y-2">
            <div>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                {t.fieldLayer}
              </span>
              <span className="bg-blue-50 text-[#006BB2] border border-blue-200 px-3 py-1 rounded-md text-xs font-bold inline-block">
                {layerTitle}
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                {t.sdgAlignment}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {record.sdgTags.map((sdg) => (
                  <span
                    key={sdg.id}
                    className="text-xs font-bold text-white px-2.5 py-1 rounded shadow-2xs flex items-center gap-1"
                    style={{ backgroundColor: sdg.color }}
                  >
                    <span>{sdg.code}</span>
                    <span className="text-[10px] opacity-90">({lang === 'ar' ? sdg.labelAr.split(':')[0] : sdg.code})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Environmental Sensor Metrics */}
          <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100 space-y-2">
            <span className="text-xs font-extrabold text-[#009600] uppercase tracking-wider block border-b border-emerald-200/60 pb-1">
              {t.environmentalMetrics}
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {record.metrics.ndvi !== undefined && (
                <div className="bg-white p-2 rounded border border-emerald-200">
                  <span className="text-[10px] text-slate-500 block">{t.vegetationIndex}</span>
                  <span className="font-extrabold text-emerald-800 text-sm font-coord">{record.metrics.ndvi}</span>
                </div>
              )}
              {record.metrics.waterPh !== undefined && (
                <div className="bg-white p-2 rounded border border-emerald-200">
                  <span className="text-[10px] text-slate-500 block">{t.waterPh}</span>
                  <span className="font-extrabold text-blue-800 text-sm font-coord">{record.metrics.waterPh}</span>
                </div>
              )}
              {record.metrics.waterSalinityPpm !== undefined && (
                <div className="bg-white p-2 rounded border border-emerald-200">
                  <span className="text-[10px] text-slate-500 block">{t.salinity}</span>
                  <span className="font-extrabold text-amber-800 text-sm font-coord">{record.metrics.waterSalinityPpm} PPM</span>
                </div>
              )}
              {record.metrics.biodiversityIndex !== undefined && (
                <div className="bg-white p-2 rounded border border-emerald-200">
                  <span className="text-[10px] text-slate-500 block">{t.biodiversityIndex}</span>
                  <span className="font-extrabold text-purple-800 text-sm font-coord">{record.metrics.biodiversityIndex}/100</span>
                </div>
              )}
              {record.metrics.soilOrganicContent !== undefined && (
                <div className="bg-white p-2 rounded border border-emerald-200">
                  <span className="text-[10px] text-slate-500 block">{t.soilOrganic}</span>
                  <span className="font-extrabold text-slate-800 text-sm font-coord">{record.metrics.soilOrganicContent}%</span>
                </div>
              )}
              {record.metrics.ambientTempC !== undefined && (
                <div className="bg-white p-2 rounded border border-emerald-200">
                  <span className="text-[10px] text-slate-500 block">{t.ambientTemp}</span>
                  <span className="font-extrabold text-orange-700 text-sm font-coord">{record.metrics.ambientTempC}°C</span>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-700 block">
              {lang === 'ar' ? 'ملاحظات المسح الميداني:' : 'Surveyor Notes:'}
            </span>
            <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed italic">
              "{lang === 'ar' ? record.notesAr : record.notesEn}"
            </p>
          </div>

          {/* Collector & Team Meta */}
          <div className="bg-slate-100 p-3 rounded-lg border border-[#D1DCE5] text-xs space-y-1">
            <div className="flex items-center justify-between text-slate-700">
              <span className="flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5 text-[#006BB2]" />
                <span>{record.collectorName}</span>
              </span>
              <span className="text-slate-500 font-coord">{record.collectedDate}</span>
            </div>
            <div className="text-[11px] text-slate-500 pl-5 rtl:pl-0 rtl:pr-5">
              {record.collectorTeam}
            </div>
          </div>

        </div>

        {/* Action Footer */}
        <div className="p-3 bg-slate-100 border-t border-[#D1DCE5] flex items-center justify-between">
          <button
            onClick={() => onExportGeoJsonRecord(record)}
            className="px-3 py-1.5 text-xs bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 rounded-md font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#006BB2]" />
            <span>{t.exportGeoJson}</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs bg-[#006BB2] hover:bg-[#005794] text-white rounded-md font-bold transition-colors cursor-pointer"
          >
            {t.cancel}
          </button>
        </div>

      </div>
    </div>
  );
};
