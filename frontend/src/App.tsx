import React, { useState, useEffect, useCallback } from 'react';
import { 
  Language, 
  GeoPointRecord, 
  SpatialLayerConfig, 
  MapFilterState, 
  LayerId,
  AppView 
} from './types';
import { INITIAL_LAYERS, INITIAL_GEO_POINTS } from './data/mockData';
import { translations } from './data/translations';
import { observationsApi, surveysApi } from './services/api';
import { geoObservationToGeoPoint, formSubmissionToGeoPoint } from './utils/adapters';
import { Header } from './components/Header';
import { LayerControlPanel } from './components/LayerControlPanel';
import { GisMapContainer } from './components/GisMapContainer';
import { DataDrawerTable } from './components/DataDrawerTable';
import { GeoDataSubmissionModal } from './components/GeoDataSubmissionModal';
import { AnalyticsModal } from './components/AnalyticsModal';
import { AboutUsModal } from './components/AboutUsModal';
import { RecordDetailDrawer } from './components/RecordDetailDrawer';
import { EcoFormsHub } from './components/EcoFormsHub';
import { BlogAndPartnersHub } from './components/BlogAndPartnersHub';

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [currentView, setCurrentView] = useState<AppView>('map');
  const [isOptionsDrawerOpen, setIsOptionsDrawerOpen] = useState<boolean>(false);

  const [layers, setLayers] = useState<SpatialLayerConfig[]>(INITIAL_LAYERS);
  const [geoPoints, setGeoPoints] = useState<GeoPointRecord[]>(INITIAL_GEO_POINTS);
  const [isLoadingBackendData, setIsLoadingBackendData] = useState<boolean>(false);
  const [backendSyncStatus, setBackendSyncStatus] = useState<'connected' | 'offline'>('connected');
  
  const [filters, setFilters] = useState<MapFilterState>({
    searchQuery: '',
    selectedGovernorate: 'all',
    selectedLayerIds: INITIAL_LAYERS.map((l) => l.id),
    selectedStatus: 'all',
    selectedSdg: 'all',
    threatFilter: 'all',
    dateRange: { start: '', end: '' },
  });

  const [selectedPoint, setSelectedPoint] = useState<GeoPointRecord | null>(null);
  const [detailRecord, setDetailRecord] = useState<GeoPointRecord | null>(null);

  // Modals
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState<boolean>(false);
  const [isAboutUsModalOpen, setIsAboutUsModalOpen] = useState<boolean>(false);

  // Map coordinate picking mode
  const [isMapPickMode, setIsMapPickMode] = useState<boolean>(false);
  const [pickedLat, setPickedLat] = useState<number | undefined>(undefined);
  const [pickedLng, setPickedLng] = useState<number | undefined>(undefined);

  // Toggle RTL / LTR document attributes
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Load live data from Django Backend API on Mount
  const loadBackendSpatialData = useCallback(async () => {
    setIsLoadingBackendData(true);
    try {
      const [obsRes, subsRes] = await Promise.allSettled([
        observationsApi.list(),
        surveysApi.getSubmissions(),
      ]);

      const backendPoints: GeoPointRecord[] = [];

      if (obsRes.status === 'fulfilled') {
        const obsList = Array.isArray(obsRes.value) ? obsRes.value : (obsRes.value?.results || []);
        obsList.forEach((obs: any) => {
          backendPoints.push(geoObservationToGeoPoint(obs));
        });
      }

      if (subsRes.status === 'fulfilled') {
        const subsData = subsRes.value;
        if (subsData?.type === 'FeatureCollection' && Array.isArray(subsData.features)) {
          subsData.features.forEach((feat: any) => {
            const sub = {
              id: feat.id || feat.properties?.id,
              form: feat.properties?.form,
              form_title: feat.properties?.form_title,
              data: feat.properties?.data || {},
              location: feat.geometry,
              status: feat.properties?.status || 'PENDING',
              submitted_by_username: feat.properties?.submitted_by_username,
              created_at: feat.properties?.created_at,
            };
            backendPoints.push(formSubmissionToGeoPoint(sub));
          });
        } else if (Array.isArray(subsData)) {
          subsData.forEach((sub: any) => {
            backendPoints.push(formSubmissionToGeoPoint(sub));
          });
        }
      }

      if (backendPoints.length > 0) {
        // Merge backend points with initial Syrian reference locations (deduping by ID)
        const idSet = new Set(backendPoints.map(p => p.id));
        const merged = [
          ...backendPoints,
          ...INITIAL_GEO_POINTS.filter(p => !idSet.has(p.id))
        ];
        setGeoPoints(merged);
        setBackendSyncStatus('connected');
      } else {
        // Kept initial Syrian geo points for complete preview
        setBackendSyncStatus('connected');
      }
    } catch (err) {
      console.warn('Backend API connection note:', err);
      setBackendSyncStatus('offline');
    } finally {
      setIsLoadingBackendData(false);
    }
  }, []);

  useEffect(() => {
    loadBackendSpatialData();
  }, [loadBackendSpatialData]);

  const handleLanguageToggle = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  // Toggle single layer active state
  const handleToggleLayer = (layerId: LayerId) => {
    setLayers((prevLayers) =>
      prevLayers.map((l) =>
        l.id === layerId ? { ...l, active: !l.active } : l
      )
    );
  };

  // Filter geo points according to sidebar state
  const filteredPoints = geoPoints.filter((point) => {
    // Check if point's layer is active
    const activeLayerIds = layers.filter((l) => l.active).map((l) => l.id);
    if (!activeLayerIds.includes(point.layerId)) return false;

    // Search query
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchNameAr = point.siteNameAr.toLowerCase().includes(q);
      const matchNameEn = point.siteNameEn.toLowerCase().includes(q);
      const matchId = point.id.toLowerCase().includes(q);
      const matchGov = point.governorate.toLowerCase().includes(q);
      if (!matchNameAr && !matchNameEn && !matchId && !matchGov) return false;
    }

    // Governorate
    if (filters.selectedGovernorate !== 'all' && point.governorate !== filters.selectedGovernorate) {
      return false;
    }

    // Status
    if (filters.selectedStatus !== 'all' && point.verificationStatus !== filters.selectedStatus) {
      return false;
    }

    // SDG
    if (filters.selectedSdg !== 'all') {
      const hasSdg = point.sdgTags.some((s) => s.code === filters.selectedSdg);
      if (!hasSdg) return false;
    }

    // Threat
    if (filters.threatFilter !== 'all' && point.threatLevel !== filters.threatFilter) {
      return false;
    }

    return true;
  });

  // Count active verified points
  const verifiedCount = filteredPoints.filter((p) => p.verificationStatus === 'verified').length;
  const activeLayersCount = layers.filter((l) => l.active).length;

  // Handle preset filters
  const handleApplyPreset = (presetName: string) => {
    switch (presetName) {
      case 'euphrates':
        setFilters((prev) => ({
          ...prev,
          selectedGovernorate: 'Raqqa',
          selectedStatus: 'all',
          selectedSdg: 'all',
          searchQuery: '',
        }));
        break;
      case 'barada':
        setFilters((prev) => ({
          ...prev,
          selectedGovernorate: 'Rural Damascus',
          selectedStatus: 'all',
          selectedSdg: 'all',
          searchQuery: '',
        }));
        break;
      case 'coastal':
        setFilters((prev) => ({
          ...prev,
          selectedGovernorate: 'Latakia',
          selectedStatus: 'all',
          selectedSdg: 'all',
          searchQuery: '',
        }));
        break;
      case 'badia':
        setFilters((prev) => ({
          ...prev,
          selectedGovernorate: 'Homs',
          selectedStatus: 'all',
          selectedSdg: 'all',
          searchQuery: '',
        }));
        break;
      default:
        break;
    }
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      selectedGovernorate: 'all',
      selectedLayerIds: layers.map((l) => l.id),
      selectedStatus: 'all',
      selectedSdg: 'all',
      threatFilter: 'all',
      dateRange: { start: '', end: '' },
    });
    setLayers((prev) => prev.map((l) => ({ ...l, active: true })));
  };

  // Submit new GeoPoint Record
  const handleRecordSubmit = (newRecord: GeoPointRecord) => {
    setGeoPoints((prev) => [newRecord, ...prev]);
    setLayers((prevLayers) =>
      prevLayers.map((l) =>
        l.id === newRecord.layerId ? { ...l, pointCount: l.pointCount + 1 } : l
      )
    );
    setSelectedPoint(newRecord);
  };

  // Handle map pick mode
  const handleCoordinatePicked = (lat: number, lng: number) => {
    setPickedLat(lat);
    setPickedLng(lng);
    setIsMapPickMode(false);
    if (currentView === 'forms') {
      // Return to forms
    } else {
      setIsSubmitModalOpen(true);
    }
  };

  const handleActivateMapPickerFromForms = () => {
    setCurrentView('map');
    setIsMapPickMode(true);
  };

  // Export handlers
  const handleExportCsv = () => {
    const headers = ['ID', 'SiteName_AR', 'SiteName_EN', 'Governorate', 'Lat', 'Lng', 'Elevation', 'Layer', 'Status', 'Date'];
    const rows = filteredPoints.map(p => [
      p.id,
      `"${p.siteNameAr}"`,
      `"${p.siteNameEn}"`,
      p.governorate,
      p.lat,
      p.lng,
      p.elevation,
      p.layerId,
      p.verificationStatus,
      p.collectedDate
    ].join(','));
    
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TSNEIP_Syria_GeoData_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportGeoJson = () => {
    const geoJsonData = {
      type: 'FeatureCollection',
      name: 'TSNEIP_Syrian_National_Ecosystem_Platform',
      crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
      features: filteredPoints.map(p => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [p.lng, p.lat, p.elevation]
        },
        properties: {
          id: p.id,
          siteNameAr: p.siteNameAr,
          siteNameEn: p.siteNameEn,
          governorate: p.governorate,
          layerId: p.layerId,
          verificationStatus: p.verificationStatus,
          collectedDate: p.collectedDate,
          collectorName: p.collectorName,
          metrics: p.metrics
        }
      }))
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(geoJsonData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `TSNEIP_Syria_Spatial_${new Date().toISOString().split('T')[0]}.geojson`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.removeChild(downloadAnchor);
  };

  const handleExportKml = () => {
    const kmlHeader = `<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2">\n<Document>\n<name>TSNEIP Syria National Geo Points</name>`;
    const kmlFooter = `\n</Document>\n</kml>`;
    const placemarks = filteredPoints.map(p => `
      <Placemark>
        <name>${p.siteNameEn} (${p.id})</name>
        <description>${p.siteNameAr} - Governorate: ${p.governorate}</description>
        <Point>
          <coordinates>${p.lng},${p.lat},${p.elevation}</coordinates>
        </Point>
      </Placemark>
    `).join('\n');

    const kmlContent = 'data:application/vnd.google-earth.kml+xml;charset=utf-8,' + encodeURIComponent(kmlHeader + placemarks + kmlFooter);
    const a = document.createElement('a');
    a.href = kmlContent;
    a.download = `TSNEIP_Syria_${new Date().toISOString().split('T')[0]}.kml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleExportPdfReport = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#E3EAEF] text-[#1E293B] overflow-hidden">
      
      {/* Top Header */}
      <Header
        lang={lang}
        currentView={currentView}
        onViewChange={setCurrentView}
        onLanguageToggle={handleLanguageToggle}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        onOpenAnalyticsModal={() => setIsAnalyticsModalOpen(true)}
        onOpenAboutUsModal={() => setIsAboutUsModalOpen(true)}
        activeLayersCount={activeLayersCount}
        totalPointsCount={filteredPoints.length}
        verifiedCount={verifiedCount}
        isOptionsDrawerOpen={isOptionsDrawerOpen}
        onToggleOptionsDrawer={() => setIsOptionsDrawerOpen(!isOptionsDrawerOpen)}
      />

      {/* Main Workspace: Conditionally render based on currentView */}
      {currentView === 'map' && (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          
          {/* Collapsible Overlay Sidebar Options Panel */}
          {isOptionsDrawerOpen && (
            <div className="absolute top-0 bottom-0 left-0 rtl:left-auto rtl:right-0 z-30 w-full sm:w-80 xl:w-96 shadow-2xl transition-all animate-fade-in">
              <LayerControlPanel
                lang={lang}
                layers={layers}
                onToggleLayer={handleToggleLayer}
                filters={filters}
                onFilterChange={setFilters}
                onResetFilters={handleResetFilters}
                onApplyPreset={handleApplyPreset}
                onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
                totalFilteredCount={filteredPoints.length}
              />
            </div>
          )}

          {/* Center Spatial Map Container (100% full screen by default) */}
          <GisMapContainer
            lang={lang}
            geoPoints={filteredPoints}
            layers={layers}
            selectedPoint={selectedPoint}
            onSelectPoint={setSelectedPoint}
            onViewRecordDetails={setDetailRecord}
            isMapPickMode={isMapPickMode}
            onCoordinatePicked={handleCoordinatePicked}
          />

        </div>
      )}

      {currentView === 'forms' && (
        <EcoFormsHub
          lang={lang}
          onRecordSubmitted={handleRecordSubmit}
          onOpenMapPicker={handleActivateMapPickerFromForms}
          pickedLat={pickedLat}
          pickedLng={pickedLng}
        />
      )}

      {currentView === 'blog' && (
        <BlogAndPartnersHub
          lang={lang}
          onSelectMapPoint={(pointId) => {
            const found = geoPoints.find(p => p.id === pointId);
            if (found) {
              setSelectedPoint(found);
              setCurrentView('map');
            }
          }}
        />
      )}

      {/* Bottom Collapsible Synchronized Data Table (Only in Map view) */}
      {currentView === 'map' && (
        <DataDrawerTable
          lang={lang}
          geoPoints={filteredPoints}
          layers={layers}
          selectedPoint={selectedPoint}
          onSelectPoint={setSelectedPoint}
          onViewRecordDetails={setDetailRecord}
          onExportCsv={handleExportCsv}
          onExportGeoJson={handleExportGeoJson}
          onExportKml={handleExportKml}
          onExportPdfReport={handleExportPdfReport}
        />
      )}

      {/* Submit Geo-Data Modal Form */}
      <GeoDataSubmissionModal
        lang={lang}
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        layers={layers}
        onSubmitRecord={handleRecordSubmit}
        onActivateMapPickMode={() => {
          setIsSubmitModalOpen(false);
          setCurrentView('map');
          setIsMapPickMode(true);
        }}
        pickedLat={pickedLat}
        pickedLng={pickedLng}
      />

      {/* Spatial Ecosystem Analytics Dashboard */}
      <AnalyticsModal
        lang={lang}
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        geoPoints={filteredPoints}
        layers={layers}
      />

      {/* About Us / Al Tatweer Foundation Information Modal */}
      <AboutUsModal
        lang={lang}
        isOpen={isAboutUsModalOpen}
        onClose={() => setIsAboutUsModalOpen(false)}
      />

      {/* Full Record Details Drawer */}
      <RecordDetailDrawer
        lang={lang}
        record={detailRecord}
        onClose={() => setDetailRecord(null)}
        layers={layers}
        onExportGeoJsonRecord={handleExportGeoJson}
      />

    </div>
  );
}
