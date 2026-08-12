import React from 'react';
import { 
  Language, 
  MapFilterState, 
  SpatialLayerConfig, 
  LayerId,
  SyrianGovernorate 
} from '../types';
import { translations } from '../data/translations';
import { SDG_TAGS } from '../data/mockData';
import { 
  Search, 
  Filter, 
  Layers, 
  MapPin, 
  RotateCcw, 
  Compass, 
  Droplets, 
  Trees, 
  Leaf, 
  ShieldAlert, 
  Wind,
  Plus,
  SlidersHorizontal,
  BookmarkCheck,
  Tag
} from 'lucide-react';

interface LayerControlPanelProps {
  lang: Language;
  layers: SpatialLayerConfig[];
  onToggleLayer: (layerId: LayerId) => void;
  filters: MapFilterState;
  onFilterChange: (newFilters: MapFilterState) => void;
  onResetFilters: () => void;
  onApplyPreset: (presetName: string) => void;
  onOpenSubmitModal: () => void;
  totalFilteredCount: number;
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

const LAYER_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Compass,
  Droplets,
  Trees,
  Leaf,
  ShieldAlert,
  Wind,
};

export const LayerControlPanel: React.FC<LayerControlPanelProps> = ({
  lang,
  layers,
  onToggleLayer,
  filters,
  onFilterChange,
  onResetFilters,
  onApplyPreset,
  onOpenSubmitModal,
  totalFilteredCount,
}) => {
  const t = translations[lang];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchQuery: e.target.value });
  };

  const handleGovChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, selectedGovernorate: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, selectedStatus: e.target.value });
  };

  const handleSdgChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, selectedSdg: e.target.value });
  };

  const handleThreatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, threatFilter: e.target.value });
  };

  return (
    <aside className="w-full lg:w-80 xl:w-96 bg-white border-l border-[#D1DCE5] rtl:border-l-0 rtl:border-r flex flex-col h-full shadow-md select-none shrink-0 overflow-hidden">
      
      {/* Sidebar Header */}
      <div className="bg-[#006BB2] text-white p-3.5 border-b border-[#005794] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-emerald-300" />
          <div>
            <h2 className="text-sm font-bold font-heading leading-tight">{t.layerControlTitle}</h2>
            <p className="text-[11px] text-blue-100">{t.layerSubtitle}</p>
          </div>
        </div>
        <span className="bg-[#009600] text-white text-[11px] font-mono font-bold px-2 py-0.5 rounded-md">
          {totalFilteredCount} {lang === 'ar' ? 'سجل' : 'pts'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2 text-xs bg-slate-50 border border-[#D1DCE5] rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006BB2] focus:border-transparent transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
              className="absolute right-2.5 rtl:right-auto rtl:left-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ×
            </button>
          )}
        </div>

        {/* Action Trigger Button */}
        <button
          onClick={onOpenSubmitModal}
          className="w-full py-2 px-3 bg-[#009600] hover:bg-[#008000] text-white rounded-md text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all border border-emerald-600 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.submitGeoData}</span>
        </button>

        {/* Spatial Layer Toggles */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#006BB2]" />
              <span>{t.layerCategories}</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">
              ({layers.filter(l => l.active).length} / {layers.length})
            </span>
          </div>

          <div className="space-y-1.5">
            {layers.map((layer) => {
              const IconComp = LAYER_ICONS[layer.iconName] || Layers;
              return (
                <label
                  key={layer.id}
                  className={`flex items-center justify-between p-2 rounded-md border text-xs cursor-pointer transition-all ${
                    layer.active 
                      ? 'bg-slate-50 border-[#006BB2]/40 shadow-xs' 
                      : 'bg-white border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={layer.active}
                      onChange={() => onToggleLayer(layer.id)}
                      className="w-4 h-4 rounded text-[#009600] focus:ring-[#009600] border-slate-300 accent-[#009600]"
                    />
                    <div className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: layer.color }} />
                    <IconComp className="w-4 h-4 text-slate-600 shrink-0" />
                    <span className="font-semibold text-slate-800">
                      {lang === 'ar' ? layer.titleAr : layer.titleEn}
                    </span>
                  </div>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono font-medium">
                    {layer.pointCount}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Filter Controls Accordion / Form */}
        <div className="bg-slate-50 p-3 rounded-lg border border-[#D1DCE5] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#009600]" />
              <span>{t.layerSubtitle}</span>
            </h3>
            <button
              onClick={onResetFilters}
              className="text-[11px] text-[#006BB2] hover:underline font-medium flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t.resetFilters}</span>
            </button>
          </div>

          {/* Governorate Dropdown */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              {t.governorateFilter}
            </label>
            <select
              value={filters.selectedGovernorate}
              onChange={handleGovChange}
              className="w-full py-1.5 px-2.5 text-xs bg-white border border-[#D1DCE5] rounded-md focus:outline-none focus:ring-1 focus:ring-[#006BB2] text-slate-800"
            >
              <option value="all">{t.allGovernorates}</option>
              {GOVERNORATES.map((gov) => (
                <option key={gov} value={gov}>
                  {gov}
                </option>
              ))}
            </select>
          </div>

          {/* Verification Status */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              {t.verificationStatusFilter}
            </label>
            <select
              value={filters.selectedStatus}
              onChange={handleStatusChange}
              className="w-full py-1.5 px-2.5 text-xs bg-white border border-[#D1DCE5] rounded-md focus:outline-none focus:ring-1 focus:ring-[#006BB2] text-slate-800"
            >
              <option value="all">{t.allStatuses}</option>
              <option value="verified">{t.verifiedOnly}</option>
              <option value="pending">{t.pendingOnly}</option>
              <option value="needs_audit">{t.needsAuditOnly}</option>
            </select>
          </div>

          {/* SDG Dropdown */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              {t.sdgFilter}
            </label>
            <select
              value={filters.selectedSdg}
              onChange={handleSdgChange}
              className="w-full py-1.5 px-2.5 text-xs bg-white border border-[#D1DCE5] rounded-md focus:outline-none focus:ring-1 focus:ring-[#006BB2] text-slate-800"
            >
              <option value="all">{t.allSdgs}</option>
              {Object.values(SDG_TAGS).map((sdg) => (
                <option key={sdg.id} value={sdg.code}>
                  {sdg.code}: {lang === 'ar' ? sdg.labelAr : sdg.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* Threat Level */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              {t.threatLevel}
            </label>
            <select
              value={filters.threatFilter}
              onChange={handleThreatChange}
              className="w-full py-1.5 px-2.5 text-xs bg-white border border-[#D1DCE5] rounded-md focus:outline-none focus:ring-1 focus:ring-[#006BB2] text-slate-800"
            >
              <option value="all">{t.allThreats}</option>
              <option value="critical">{t.threatCritical}</option>
              <option value="high">{t.threatHigh}</option>
              <option value="moderate">{t.threatModerate}</option>
              <option value="low">{t.threatLow}</option>
            </select>
          </div>
        </div>

        {/* Quick Basin Presets */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <BookmarkCheck className="w-4 h-4 text-[#009600]" />
            <span>{t.presetFilterTitle}</span>
          </h3>
          <div className="grid grid-cols-1 gap-1.5">
            <button
              onClick={() => onApplyPreset('euphrates')}
              className="w-full text-right rtl:text-right ltr:text-left px-2.5 py-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-[#006BB2] border border-blue-200 rounded-md transition-all font-medium flex items-center justify-between"
            >
              <span>{t.presetEuphrates}</span>
              <span className="text-[10px] font-mono bg-blue-200 text-blue-800 px-1 rounded">Raqqa / Deir ez-Zor</span>
            </button>
            <button
              onClick={() => onApplyPreset('barada')}
              className="w-full text-right rtl:text-right ltr:text-left px-2.5 py-1.5 text-xs bg-emerald-50 hover:bg-emerald-100 text-[#009600] border border-emerald-200 rounded-md transition-all font-medium flex items-center justify-between"
            >
              <span>{t.presetBarada}</span>
              <span className="text-[10px] font-mono bg-emerald-200 text-emerald-800 px-1 rounded">Damascus Basin</span>
            </button>
            <button
              onClick={() => onApplyPreset('coastal')}
              className="w-full text-right rtl:text-right ltr:text-left px-2.5 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-md transition-all font-medium flex items-center justify-between"
            >
              <span>{t.presetCoastal}</span>
              <span className="text-[10px] font-mono bg-slate-200 text-slate-800 px-1 rounded">Latakia / Tartus</span>
            </button>
            <button
              onClick={() => onApplyPreset('badia')}
              className="w-full text-right rtl:text-right ltr:text-left px-2.5 py-1.5 text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-md transition-all font-medium flex items-center justify-between"
            >
              <span>{t.presetBadia}</span>
              <span className="text-[10px] font-mono bg-amber-200 text-amber-900 px-1 rounded">Homs / Oasis</span>
            </button>
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-100 border-t border-[#D1DCE5] text-[11px] text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Tag className="w-3.5 h-3.5 text-emerald-600" />
          <span>WGS 84 / UTM zone 37N</span>
        </span>
        <span className="font-mono font-semibold text-slate-700">SY-GIS v2.6</span>
      </div>

    </aside>
  );
};
