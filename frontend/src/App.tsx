import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Language, 
  GeoPointRecord, 
  SpatialLayerConfig, 
  MapFilterState, 
  LayerId,
  AppView 
} from './types';
import { INITIAL_LAYERS, INITIAL_GEO_POINTS } from './data/mockData';
import { observationService, layerService } from './services/api';
import { useAuth } from './context/AuthContext';
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
  const { user, isAuthenticated } = useAuth();

  const [lang, setLang] = useState<Language>('ar');
  const [currentView, setCurrentView] = useState<AppView>('map');
  const [isOptionsDrawerOpen, setIsOptionsDrawerOpen] = useState<boolean>(false);

  // Async API State with Mock Data Fallback
  const [layers, setLayers] = useState<SpatialLayerConfig[]>([]);
  const [geoPoints, setGeoPoints] = useState<GeoPointRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const [filters, setFilters] = useState<MapFilterState>({
    searchQuery: '',
    selectedGovernorate: 'all',
    selectedLayerIds: [],
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

  // Document direction & language sync
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Initial Fetch from Django REST Framework & PostGIS Endpoints
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const [fetchedLayers, fetchedPoints] = await Promise.all([
        layerService.getLayers(),
        observationService.getObservations(),
      ]);

      const layerData = fetchedLayers?.length ? fetchedLayers : INITIAL_LAYERS;
      const pointData = fetchedPoints?.length ? fetchedPoints : INITIAL_GEO_POINTS;

      setLayers(layerData);
      setGeoPoints(pointData);
      setFilters((prev) => ({
        ...prev,
        selectedLayerIds: layerData.map((l) => l.id),
      }));
    } catch (err) {
      console.warn('Backend API unavailable. Falling back to local datasets:', err);
      setLayers(INITIAL_LAYERS);
      setGeoPoints(INITIAL_GEO_POINTS);
      setFilters((prev) => ({
        ...prev,
        selectedLayerIds: INITIAL_LAYERS.map((l) => l.id),
      }));
      setApiError('Connected in offline/fallback mode.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleLanguageToggle = useCallback(() => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  }, []);

  // Layer toggle handler
  const handleToggleLayer = useCallback((layerId: LayerId) => {
    setLayers((prevLayers) =>
      prevLayers.map((l) =>
        l.id === layerId ? { ...l, active: !l.active } : l
      )
    );
  }, []);

  // Memoized Point Filtering Engine
  const filteredPoints = useMemo(() => {
    const activeLayerIds = layers.filter((l) => l.active).map((l) => l.id);

    return geoPoints.filter((point) => {
      if (!activeLayerIds.includes(point.layerId)) return false;

      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchNameAr = point.siteNameAr?.toLowerCase().includes(q);
        const matchNameEn = point.siteNameEn?.toLowerCase().includes(q);
        const matchId = point.id?.toLowerCase().includes(q);
        const matchGov = point.governorate?.toLowerCase().includes(q);
        if (!matchNameAr && !matchNameEn && !matchId && !matchGov) return false;
      }

      if (filters.selectedGovernorate !== 'all' && point.governorate !== filters.selectedGovernorate) {
        return false;
      }

      if (filters.selectedStatus !== 'all' && point.verificationStatus !== filters.selectedStatus) {
        return false;
      }

      if (filters.selectedSdg !== 'all') {
        const hasSdg = point.sdgTags?.some((s) => s.code === filters.selectedSdg);
        if (!hasSdg) return false;
      }

      if (filters.threatFilter !== 'all' && point.threatLevel !== filters.threatFilter) {
        return false;
      }

      return true;
    });
  }, [geoPoints, layers, filters]);

  // Memoized derived metrics
  const verifiedCount = useMemo(
    () => filteredPoints.filter((p) => p.verificationStatus === 'verified').length,
    [filteredPoints]
  );

  const activeLayersCount = useMemo(
    () => layers.filter((l) => l.active).length,
    [layers]
  );

  // Filter Presets
  const handleApplyPreset = useCallback((presetName: string) => {
    const presetMap: Record<string, string> = {
      euphrates: 'Raqqa',
      barada: 'Rural Damascus',
      coastal: 'Latakia',
      badia: 'Homs',
    };

    if (presetMap[presetName]) {
      setFilters((prev) => ({
        ...prev,
        selectedGovernorate: presetMap[presetName],
        selectedStatus: 'all',
        selectedSdg: 'all',
        searchQuery: '',
      }));
    }
  }, []);

  const handleResetFilters = useCallback(() => {
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
  }, [layers]);

  // Async PostGIS Record Submission
  const handleRecordSubmit = useCallback(async (newRecord: GeoPointRecord) => {
    try {
      const createdRecord = await observationService.createObservation(newRecord);
      const recordToAdd = createdRecord || newRecord;

      setGeoPoints((prev) => [recordToAdd, ...prev]);
      setLayers((prevLayers) =>
        prevLayers.map((l) =>
          l.id === recordToAdd.layerId ? { ...l, pointCount: l.pointCount + 1 } : l
        )
      );
      setSelectedPoint(recordToAdd);
    } catch (err) {
      console.error('Failed to post observation record to backend:', err);
      setGeoPoints((prev) => [newRecord, ...prev]);
      setSelectedPoint(newRecord);
    }
  }, []);

  // Map Coordinate Picker Handlers
  const handleCoordinatePicked = useCallback((lat: number, lng: number) => {
    setPickedLat(lat);
    setPickedLng(lng);
    setIsMapPickMode(false);
    if (currentView !== 'forms') {
      setIsSubmitModalOpen(true);
    }
  }, [currentView]);

  const handleActivateMapPickerFromForms = useCallback(() => {
    setCurrentView('map');
    setIsMapPickMode(true);
  }, []);

  // Exporters
  const handleExportCsv = useCallback(() => {
    const headers = ['ID', 'SiteName_AR', 'SiteName_EN', 'Governorate', 'Lat', 'Lng', 'Elevation', 'Layer', 'Status', 'Date'];
    const rows = filteredPoints.map((p) => [
      p.id,
      `"${p.siteNameAr}"`,
      `"${p.siteNameEn}"`,
      p.governorate,
      p.lat,
      p.lng,
      p.elevation,
      p.layerId,
      p.verificationStatus,
      p.collectedDate,
    ].join(','));
    
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `TSNEIP_Syria_GeoData_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredPoints]);

  const handleExportGeoJson = useCallback(() => {
    const geoJsonData = {
      type: 'FeatureCollection',
      name: 'TSNEIP_Syrian_National_Ecosystem_Platform',
      crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
      features: filteredPoints.map((p) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [p.lng, p.lat, p.elevation || 0],
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
          metrics: p.metrics,
        },
      })),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(geoJsonData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = dataStr;
    downloadAnchor.download = `TSNEIP_Syria_Spatial_${new Date().toISOString().split('T')[0]}.geojson`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.removeChild(downloadAnchor);
  }, [filteredPoints]);

  const handleExportKml = useCallback(() => {
    const kmlHeader = `<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2">\n<Document>\n<name>TSNEIP Syria National Geo Points</name>`;
    const kmlFooter = `\n</Document>\n</kml>`;
    const placemarks = filteredPoints.map((p) => `
      <Placemark>
        <name>${p.siteNameEn || p.id}</name>
        <description>${p.siteNameAr || ''} - Governorate: ${p.governorate}</description>
        <Point>
          <coordinates>${p.lng},${p.lat},${p.elevation || 0}</coordinates>
        </Point>
      </Placemark>
    `).join('\n');

    const kmlContent = 'data:application/vnd.google-earth.kml+xml;charset=utf-8,' + encodeURIComponent(kmlHeader + placemarks + kmlFooter);
    const link = document.createElement('a');
    link.href = kmlContent;
    link.download = `TSNEIP_Syria_${new Date().toISOString().split('T')[0]}.kml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredPoints]);

  const handleExportPdfReport = useCallback(() => {
    window.print();
  }, []);

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
        onToggleOptionsDrawer={() => setIsOptionsDrawerOpen((prev) => !prev)}
      />

      {/* Offline/API Status Banner */}
      {apiError && (
        <div className="bg-amber-100 border-b border-amber-300 text-amber-800 text-xs px-4 py-1 flex justify-between items-center z-40">
          <span>{apiError}</span>
          <button 
            onClick={loadInitialData}
            className="underline font-medium hover:text-amber-950"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#0F4C81] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-sm font-medium text-[#0F4C81]">Loading spatial datasets & PostGIS layers...</p>
        </div>
      )}

      {/* Main Workspace */}
      {currentView === 'map' && (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          
          {/* Collapsible Layer Control Options Drawer */}
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

          {/* Gis Map Container */}
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
            const found = geoPoints.find((p) => p.id === pointId);
            if (found) {
              setSelectedPoint(found);
              setCurrentView('map');
            }
          }}
        />
      )}

      {/* Data Drawer Table (Map view) */}
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

      {/* Geo Data Submission Modal */}
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

      {/* Analytics Modal */}
      <AnalyticsModal
        lang={lang}
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        geoPoints={filteredPoints}
        layers={layers}
      />

      {/* About Us Modal */}
      <AboutUsModal
        lang={lang}
        isOpen={isAboutUsModalOpen}
        onClose={() => setIsAboutUsModalOpen(false)}
      />

      {/* Record Details Drawer */}
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