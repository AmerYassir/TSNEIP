import React, { useState } from 'react';
import { 
  Language, 
  Observation, 
  VerificationStatus,
  SpatialLayerConfig 
} from '../types';
import { translations } from '../data/translations';
import { 
  Table, 
  ChevronUp, 
  ChevronDown, 
  Download, 
  FileText, 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Search,
  Eye
} from 'lucide-react';

interface DataDrawerTableProps {
  lang: Language;
  geoPoints: Observation[];
  layers: SpatialLayerConfig[];
  selectedPoint: Observation | null;
  onSelectPoint: (point: Observation) => void;
  onViewRecordDetails: (point: Observation) => void;
  onExportCsv: () => void;
  onExportGeoJson: () => void;
  onExportKml: () => void;
  onExportPdfReport: () => void;
}

export const DataDrawerTable: React.FC<DataDrawerTableProps> = ({
  lang,
  geoPoints,
  layers,
  selectedPoint,
  onSelectPoint,
  onViewRecordDetails,
  onExportCsv,
  onExportGeoJson,
  onExportKml,
  onExportPdfReport,
}) => {
  const t = translations[lang];
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [tableSearch, setTableSearch] = useState<string>('');
  const [sortField, setSortField] = useState<string>('collected_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Coordinate extraction helper for PostGIS GeoJSON [lng, lat] vs legacy properties
  const getCoordinates = (p: Observation) => {
    const lat = p.location?.coordinates ? p.location.coordinates[1] : (p as unknown as { lat: number }).lat ?? 0;
    const lng = p.location?.coordinates ? p.location.coordinates[0] : (p as unknown as { lng: number }).lng ?? 0;
    return { lat, lng };
  };

  // Helper getters to safely access attributes across snake_case and camelCase
  const getSiteName = (p: Observation) => {
    const ar = p.site_name_ar || (p as unknown as { siteNameAr: string }).siteNameAr || '';
    const en = p.site_name_en || (p as unknown as { siteNameEn: string }).siteNameEn || '';
    return lang === 'ar' ? ar : en || ar;
  };

  const getCollectorName = (p: Observation) => {
    return p.collector_name || (p as unknown as { collectorName: string }).collectorName || '';
  };

  const getLayerId = (p: Observation) => {
    return String(p.layer_id || (p as unknown as { layerId: string }).layerId || '');
  };

  const getRecordId = (p: Observation) => {
    return String(p.record_code || p.id || '');
  };

  const getStatus = (p: Observation): VerificationStatus => {
    return (p.status || (p as unknown as { verificationStatus: VerificationStatus }).verificationStatus || 'pending') as VerificationStatus;
  };

  // Filtered records inside table
  const filteredPoints = geoPoints.filter((p) => {
    if (!tableSearch) return true;
    const q = tableSearch.toLowerCase();
    const siteAr = (p.site_name_ar || (p as unknown as { siteNameAr: string }).siteNameAr || '').toLowerCase();
    const siteEn = (p.site_name_en || (p as unknown as { siteNameEn: string }).siteNameEn || '').toLowerCase();
    const gov = (p.governorate || '').toLowerCase();
    const collector = getCollectorName(p).toLowerCase();
    const recId = getRecordId(p).toLowerCase();

    return (
      recId.includes(q) ||
      siteAr.includes(q) ||
      siteEn.includes(q) ||
      gov.includes(q) ||
      collector.includes(q)
    );
  });

  // Sorting logic
  const sortedPoints = [...filteredPoints].sort((a, b) => {
    let valA: string = '';
    let valB: string = '';

    if (sortField === 'id' || sortField === 'record_code') {
      valA = getRecordId(a);
      valB = getRecordId(b);
    } else if (sortField === 'site_name_ar' || sortField === 'siteNameAr') {
      valA = getSiteName(a);
      valB = getSiteName(b);
    } else if (sortField === 'governorate') {
      valA = a.governorate || '';
      valB = b.governorate || '';
    } else if (sortField === 'collected_date' || sortField === 'collectedDate') {
      valA = a.collected_date || (a as unknown as { collectedDate: string }).collectedDate || '';
      valB = b.collected_date || (b as unknown as { collectedDate: string }).collectedDate || '';
    }

    return sortDirection === 'asc' 
      ? valA.localeCompare(valB) 
      : valB.localeCompare(valA);
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRowIds(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRowIds.length === sortedPoints.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(sortedPoints.map(p => String(p.id)));
    }
  };

  const getLayerTitle = (layerId: string) => {
    const l = layers.find(item => String(item.id) === String(layerId));
    if (!l) return layerId;
    return lang === 'ar' ? l.titleAr : l.titleEn;
  };

  const renderStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'approved':
      case 'verified':
        return (
          <span className="bg-emerald-100 text-[#009600] border border-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{t.statusVerified}</span>
          </span>
        );
      case 'pending':
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{t.statusPending}</span>
          </span>
        );
      case 'needs_audit':
      case 'rejected':
        return (
          <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>{t.statusAudit}</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-white border-t border-[#D1DCE5] shadow-lg relative z-20 flex flex-col transition-all duration-300">
      
      {/* Drawer Control Header Bar */}
      <div className="bg-[#006BB2] text-white px-4 py-2 flex items-center justify-between shadow-xs select-none">
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-white/10 rounded transition-colors flex items-center gap-2 cursor-pointer"
            title={isExpanded ? t.collapseDrawer : t.expandDrawer}
          >
            <Table className="w-4 h-4 text-emerald-300" />
            <span className="font-bold text-xs font-heading">{t.dataDrawerTitle}</span>
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          <span className="text-[11px] text-blue-200 hidden sm:inline">
            ({t.recordsCount} <strong className="text-emerald-300 font-mono text-xs">{sortedPoints.length}</strong>)
          </span>
        </div>

        {/* Search & Export Action Buttons */}
        <div className="flex items-center gap-2">
          
          <div className="relative hidden md:block">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 rtl:left-auto rtl:right-2.5 top-1.5" />
            <input
              type="text"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              placeholder={lang === 'ar' ? 'بحث بالجدول...' : 'Search table...'}
              className="pl-8 rtl:pl-2 rtl:pr-8 pr-2 py-1 text-[11px] bg-white text-slate-800 rounded border border-blue-400/40 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            />
          </div>

          <button
            onClick={onExportCsv}
            className="px-2.5 py-1 text-[11px] bg-white/15 hover:bg-white/25 text-white rounded font-medium flex items-center gap-1 transition-all cursor-pointer border border-white/20"
            title={t.exportDataCsv}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
            <span className="hidden sm:inline">{t.exportDataCsv}</span>
          </button>

          <button
            onClick={onExportGeoJson}
            className="px-2.5 py-1 text-[11px] bg-white/15 hover:bg-white/25 text-white rounded font-medium flex items-center gap-1 transition-all cursor-pointer border border-white/20"
            title={t.exportGeoJson}
          >
            <Download className="w-3.5 h-3.5 text-blue-200" />
            <span className="hidden sm:inline">GeoJSON</span>
          </button>

          <button
            onClick={onExportPdfReport}
            className="px-2.5 py-1 text-[11px] bg-[#009600] hover:bg-[#008000] text-white rounded font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer border border-emerald-500"
            title={t.exportReportPdf}
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.exportReportPdf}</span>
          </button>
        </div>

      </div>

      {/* Drawer Table Content */}
      {isExpanded && (
        <div className="max-h-60 overflow-y-auto overflow-x-auto p-0">
          <table className="w-full text-xs text-right rtl:text-right ltr:text-left border-collapse">
            <thead className="bg-slate-100 text-slate-700 sticky top-0 z-10 font-bold border-b border-[#D1DCE5] text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-2 text-center w-10">
                  <input
                    type="checkbox"
                    checked={selectedRowIds.length === sortedPoints.length && sortedPoints.length > 0}
                    onChange={toggleSelectAll}
                    className="w-3.5 h-3.5 text-[#009600] rounded focus:ring-[#009600]"
                  />
                </th>
                <th 
                  onClick={() => handleSort('record_code')}
                  className="p-2.5 cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-1 font-mono">
                    <span>{t.colId}</span>
                    {sortField === 'record_code' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('site_name_ar')}
                  className="p-2.5 cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  <span>{t.colSiteName}</span>
                </th>
                <th 
                  onClick={() => handleSort('governorate')}
                  className="p-2.5 cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  <span>{t.colGovernorate}</span>
                </th>
                <th className="p-2.5">
                  <span>{t.colCoordinates}</span>
                </th>
                <th className="p-2.5">
                  <span>{t.colLayer}</span>
                </th>
                <th className="p-2.5">
                  <span>{t.colSdg}</span>
                </th>
                <th className="p-2.5">
                  <span>{t.colStatus}</span>
                </th>
                <th className="p-2.5">
                  <span>{t.colMetrics}</span>
                </th>
                <th className="p-2.5 text-center">{t.colActions}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 text-slate-800">
              {sortedPoints.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400 italic font-medium">
                    {t.noRecordsFound}
                  </td>
                </tr>
              ) : (
                sortedPoints.map((point) => {
                  const pointId = String(point.id);
                  const isSelected = selectedPoint?.id === point.id;
                  const isChecked = selectedRowIds.includes(pointId);
                  const { lat, lng } = getCoordinates(point);
                  const sdgList = point.sdg_tags || (point as unknown as { sdgTags: typeof point.sdg_tags }).sdgTags || [];
                  const metrics = point.metrics || {};
                  const waterPh = metrics.water_ph ?? (metrics as unknown as { waterPh: number }).waterPh;
                  const bioIndex = metrics.biodiversity_index ?? (metrics as unknown as { biodiversityIndex: number }).biodiversityIndex;

                  return (
                    <tr
                      key={pointId}
                      onClick={() => onSelectPoint(point)}
                      className={`hover:bg-blue-50/60 transition-colors cursor-pointer ${
                        isSelected ? 'bg-emerald-50/80 font-medium' : ''
                      }`}
                    >
                      <td className="p-2 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectRow(pointId)}
                          className="w-3.5 h-3.5 text-[#009600] rounded focus:ring-[#009600]"
                        />
                      </td>

                      <td className="p-2.5 font-mono font-bold text-[#006BB2]">
                        {getRecordId(point)}
                      </td>

                      <td className="p-2.5 font-semibold text-slate-900">
                        {getSiteName(point)}
                      </td>

                      <td className="p-2.5 font-medium text-slate-700">
                        <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                          {point.governorate}
                        </span>
                      </td>

                      <td className="p-2.5 font-coord text-[11px] text-slate-600">
                        {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
                      </td>

                      <td className="p-2.5">
                        <span className="text-[11px] text-slate-700 font-medium">
                          {getLayerTitle(getLayerId(point))}
                        </span>
                      </td>

                      <td className="p-2.5">
                        <div className="flex flex-wrap gap-1">
                          {sdgList.map((sdg) => (
                            <span
                              key={sdg.id || sdg.code}
                              className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded shadow-2xs"
                              style={{ backgroundColor: sdg.color }}
                              title={lang === 'ar' ? sdg.label_ar || sdg.labelAr : sdg.label_en || sdg.labelEn}
                            >
                              {sdg.code}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="p-2.5">
                        {renderStatusBadge(getStatus(point))}
                      </td>

                      <td className="p-2.5 font-coord text-[11px]">
                        {metrics.ndvi !== undefined && (
                          <span className="text-emerald-700 font-semibold mr-2 rtl:mr-0 rtl:ml-2">
                            NDVI: {metrics.ndvi}
                          </span>
                        )}
                        {waterPh !== undefined && (
                          <span className="text-blue-700 font-semibold mr-2 rtl:mr-0 rtl:ml-2">
                            pH: {waterPh}
                          </span>
                        )}
                        {bioIndex !== undefined && (
                          <span className="text-purple-700 font-semibold">
                            Bio: {bioIndex}
                          </span>
                        )}
                      </td>

                      <td className="p-2.5 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onViewRecordDetails(point)}
                          className="p-1 text-[#006BB2] hover:bg-blue-100 rounded transition-colors inline-flex items-center gap-1 text-[11px] font-bold"
                          title={t.viewFullRecord}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden lg:inline">{lang === 'ar' ? 'عرض' : 'View'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};