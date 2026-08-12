import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Language, 
  GeoPointRecord, 
  SpatialLayerConfig, 
  BasemapType 
} from '../types';
import { translations } from '../data/translations';
import { 
  Layers, 
  Maximize2, 
  Flame, 
  Compass, 
  Ruler, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Clock,
  Eye,
  Crosshair,
  Sparkles,
  Info
} from 'lucide-react';

interface GisMapContainerProps {
  lang: Language;
  geoPoints: GeoPointRecord[];
  layers: SpatialLayerConfig[];
  selectedPoint: GeoPointRecord | null;
  onSelectPoint: (point: GeoPointRecord | null) => void;
  onViewRecordDetails: (point: GeoPointRecord) => void;
  isMapPickMode: boolean;
  onCoordinatePicked?: (lat: number, lng: number) => void;
}

const BASEMAP_URLS: Record<BasemapType, { url: string; attribution: string }> = {
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors | AlTatweer GIS',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS | TSNEIP',
  },
  topo: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | OpenTopoMap',
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO | Dark GIS',
  },
  terrain: {
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors, Humanitarian OpenStreetMap Team',
  },
};

// Syrian Ecosystem Polygons (Mock coordinates for major basins)
const SYRIAN_ECOSYSTEM_POLYGONS = [
  {
    nameAr: 'حوض الفرات والاهوار الحراجية',
    nameEn: 'Euphrates Basin & Wetland Zone',
    color: '#006BB2',
    coords: [
      [36.80, 38.00],
      [36.00, 40.50],
      [34.50, 40.90],
      [35.10, 38.50],
    ],
  },
  {
    nameAr: 'إقليم الغابات الساحلية والمرتفعات',
    nameEn: 'Coastal Mountain Forest Reserve',
    color: '#009600',
    coords: [
      [35.95, 35.80],
      [35.95, 36.25],
      [34.80, 36.15],
      [34.80, 35.85],
    ],
  },
  {
    nameAr: 'حوض دمشق وبردى والمحميات الجبلية',
    nameEn: 'Damascus Oasis & Barada Basin',
    color: '#36AAE0',
    coords: [
      [33.75, 36.00],
      [33.75, 36.60],
      [33.35, 36.65],
      [33.35, 36.05],
    ],
  },
  {
    nameAr: 'إقليم البادية السورية وواحة تدمر',
    nameEn: 'Syrian Desert & Oasis Ecosystem',
    color: '#D97706',
    coords: [
      [35.10, 37.50],
      [35.00, 39.50],
      [33.80, 39.20],
      [33.90, 37.20],
    ],
  },
];

export const GisMapContainer: React.FC<GisMapContainerProps> = ({
  lang,
  geoPoints,
  layers,
  selectedPoint,
  onSelectPoint,
  onViewRecordDetails,
  isMapPickMode,
  onCoordinatePicked,
}) => {
  const t = translations[lang];
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const polygonsGroupRef = useRef<L.LayerGroup | null>(null);
  const heatGroupRef = useRef<L.LayerGroup | null>(null);

  const [currentBasemap, setCurrentBasemap] = useState<BasemapType>('osm');
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);
  const [showPolygons, setShowPolygons] = useState<boolean>(true);
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on Syria (lat: 34.8, lng: 38.9, zoom 7)
    const map = L.map(mapContainerRef.current, {
      center: [34.8021, 38.9968],
      zoom: 7,
      zoomControl: false,
    });

    // Add Zoom Control at top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Initial Tile Layer
    const tileConfig = BASEMAP_URLS.osm;
    const tiles = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      maxZoom: 18,
    }).addTo(map);

    tileLayerRef.current = tiles;
    markersGroupRef.current = L.layerGroup().addTo(map);
    polygonsGroupRef.current = L.layerGroup().addTo(map);
    heatGroupRef.current = L.layerGroup().addTo(map);

    // Track mouse coordinates
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      setCursorCoords({
        lat: Number(e.latlng.lat.toFixed(4)),
        lng: Number(e.latlng.lng.toFixed(4)),
      });
    });

    // Handle map click in pick mode
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (isMapPickMode && onCoordinatePicked) {
        onCoordinatePicked(
          Number(e.latlng.lat.toFixed(5)),
          Number(e.latlng.lng.toFixed(5))
        );
      }
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Basemap Tiles
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const config = BASEMAP_URLS[currentBasemap];
    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    const newTiles = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: 18,
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTiles;
  }, [currentBasemap]);

  // Render Syrian Ecosystem Boundaries / Polygons
  useEffect(() => {
    if (!polygonsGroupRef.current) return;
    polygonsGroupRef.current.clearLayers();

    if (showPolygons) {
      SYRIAN_ECOSYSTEM_POLYGONS.forEach((poly) => {
        const polygonLayer = L.polygon(poly.coords as L.LatLngExpression[], {
          color: poly.color,
          weight: 2,
          opacity: 0.8,
          fillColor: poly.color,
          fillOpacity: 0.12,
          dashArray: '4, 4',
        });

        polygonLayer.bindTooltip(
          `<b>${lang === 'ar' ? poly.nameAr : poly.nameEn}</b>`,
          { sticky: true, className: 'text-xs font-semibold' }
        );

        polygonLayer.addTo(polygonsGroupRef.current!);
      });
    }
  }, [showPolygons, lang]);

  // Render Markers & Heatmap Circles
  useEffect(() => {
    if (!markersGroupRef.current || !heatGroupRef.current) return;
    markersGroupRef.current.clearLayers();
    heatGroupRef.current.clearLayers();

    // Map layer color map
    const layerColorMap: Record<string, string> = {};
    layers.forEach((l) => {
      layerColorMap[l.id] = l.color;
    });

    // Render Pins
    geoPoints.forEach((point) => {
      const activeLayer = layers.find((l) => l.id === point.layerId);
      if (!activeLayer || !activeLayer.active) return; // Skip if layer turned off

      const pinColor = layerColorMap[point.layerId] || '#009600';
      const isSelected = selectedPoint?.id === point.id;

      // Custom Leaflet DivIcon with Emerald Green (#009600) / Navy Blue (#006BB2) styling
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="relative group cursor-pointer" style="transform: translate(-50%, -100%);">
            <div class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 ${
              isSelected ? 'scale-125 ring-4 ring-yellow-400 z-50' : 'hover:scale-110'
            }" style="background-color: ${pinColor}; border: 2px solid white;">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div class="w-2 h-2 rounded-full bg-slate-800/40 mx-auto -mt-1 blur-[1px]"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const marker = L.marker([point.lat, point.lng], { icon: customIcon });

      // Create Rich Leaflet Popup Card
      const popupHtml = `
        <div class="w-72 bg-white rounded-lg shadow-xl overflow-hidden font-sans border border-[#D1DCE5]">
          <!-- Header Bar -->
          <div class="p-3 text-white flex items-center justify-between" style="background-color: ${pinColor};">
            <div class="flex items-center gap-1.5">
              <span class="text-[10px] font-mono font-bold uppercase bg-white/20 px-1.5 py-0.5 rounded">
                ${point.id}
              </span>
              <span class="text-xs font-bold text-white uppercase">${point.governorate}</span>
            </div>
            <span class="text-[10px] bg-white text-slate-900 font-extrabold px-1.5 py-0.5 rounded-full uppercase">
              ${point.verificationStatus === 'verified' ? (lang === 'ar' ? 'موثق' : 'Verified') : (lang === 'ar' ? 'قيد التوثيق' : 'Pending')}
            </span>
          </div>

          <!-- Body Info -->
          <div class="p-3 space-y-2 text-slate-800">
            <h4 class="font-extrabold text-sm text-slate-900 leading-snug">
              ${lang === 'ar' ? point.siteNameAr : point.siteNameEn}
            </h4>

            <div class="flex items-center gap-2 text-xs font-mono text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-200">
              <span>📍 Lat: ${point.lat.toFixed(4)}° N</span>
              <span>Long: ${point.lng.toFixed(4)}° E</span>
            </div>

            <!-- Environmental Metrics Summary -->
            <div class="grid grid-cols-2 gap-1.5 text-[11px] bg-emerald-50/60 p-2 rounded border border-emerald-100">
              ${point.metrics.ndvi ? `<div><span class="text-slate-500">NDVI:</span> <b class="text-emerald-800">${point.metrics.ndvi}</b></div>` : ''}
              ${point.metrics.waterPh ? `<div><span class="text-slate-500">Water pH:</span> <b class="text-blue-800">${point.metrics.waterPh}</b></div>` : ''}
              ${point.metrics.biodiversityIndex ? `<div><span class="text-slate-500">Bio Index:</span> <b class="text-emerald-700">${point.metrics.biodiversityIndex}/100</b></div>` : ''}
              ${point.metrics.ambientTempC ? `<div><span class="text-slate-500">Temp:</span> <b class="text-amber-800">${point.metrics.ambientTempC}°C</b></div>` : ''}
            </div>

            <!-- SDG Tags -->
            <div class="flex flex-wrap gap-1 pt-1">
              ${point.sdgTags.map(sdg => `
                <span class="text-[9px] font-bold text-white px-1.5 py-0.5 rounded" style="background-color: ${sdg.color}">
                  ${sdg.code}
                </span>
              `).join('')}
            </div>

            <!-- Collector & Date -->
            <div class="text-[10px] text-slate-500 pt-1 flex items-center justify-between border-t border-slate-100 mt-2">
              <span>👤 ${point.collectorName}</span>
              <span>📅 ${point.collectedDate}</span>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        onSelectPoint(point);
      });

      marker.addTo(markersGroupRef.current!);

      // Heatmap Simulated Circles
      if (showHeatmap) {
        const heatCircle = L.circle([point.lat, point.lng], {
          radius: 25000,
          color: pinColor,
          fillColor: pinColor,
          fillOpacity: 0.25,
          stroke: false,
        });
        heatCircle.addTo(heatGroupRef.current!);
      }
    });
  }, [geoPoints, layers, selectedPoint, showHeatmap, lang]);

  // Center view on Syria
  const handleResetMapFocus = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([34.8021, 38.9968], 7, { animate: true });
    }
  };

  return (
    <div className="relative w-full h-full flex-1 bg-slate-200 overflow-hidden">
      
      {/* Map Target HTML Element */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Map Mode Banner (If in coordinate pick mode) */}
      {isMapPickMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-emerald-600 text-white px-4 py-2 rounded-full shadow-lg font-bold text-xs flex items-center gap-2 animate-bounce border-2 border-white">
          <Crosshair className="w-4 h-4" />
          <span>{lang === 'ar' ? 'انقر على الخريطة لتحديد الموقع الجديد' : 'Click on the map to pick new coordinates'}</span>
        </div>
      )}

      {/* Top Left Floating Toolbar Overlay */}
      <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 z-20 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white/95 backdrop-blur-md p-1.5 rounded-lg shadow-md border border-[#D1DCE5] text-xs">
        
        {/* Basemap Switcher Dropdown */}
        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded border border-slate-200">
          <Layers className="w-4 h-4 text-[#006BB2]" />
          <select
            value={currentBasemap}
            onChange={(e) => setCurrentBasemap(e.target.value as BasemapType)}
            className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer text-xs"
          >
            <option value="osm">🗺️ {t.basemapOsm}</option>
            <option value="satellite">🛰️ {t.basemapSatellite}</option>
            <option value="topo">🏔️ {t.basemapTopo}</option>
            <option value="dark">🌙 {t.basemapDark}</option>
            <option value="terrain">🌲 {t.basemapTerrain}</option>
          </select>
        </div>

        {/* Heatmap Toggle */}
        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`px-2.5 py-1 rounded font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            showHeatmap 
              ? 'bg-amber-500 text-white shadow-xs' 
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
          title={t.heatmapToggle}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>{t.heatmapToggle}</span>
        </button>

        {/* Boundaries Toggle */}
        <button
          onClick={() => setShowPolygons(!showPolygons)}
          className={`px-2.5 py-1 rounded font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            showPolygons 
              ? 'bg-[#009600] text-white shadow-xs' 
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
          title={t.boundariesToggle}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>{t.boundariesToggle}</span>
        </button>

        {/* Reset View Button */}
        <button
          onClick={handleResetMapFocus}
          className="px-2.5 py-1 bg-[#006BB2] hover:bg-[#005794] text-white rounded font-semibold flex items-center gap-1 transition-all cursor-pointer"
          title={t.resetView}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.resetView}</span>
        </button>
      </div>

      {/* Floating Bottom Coordinates HUD Bar */}
      <div className="absolute bottom-3 right-3 rtl:right-auto rtl:left-3 z-20 bg-slate-900/85 backdrop-blur-md text-white px-3 py-1.5 rounded-md text-[11px] font-coord flex items-center gap-3 shadow-lg border border-slate-700">
        <div className="flex items-center gap-1 text-emerald-400">
          <Crosshair className="w-3.5 h-3.5" />
          <span>{t.cursorCoords}</span>
        </div>
        {cursorCoords ? (
          <span className="text-blue-200 font-bold">
            {cursorCoords.lat}° N, {cursorCoords.lng}° E
          </span>
        ) : (
          <span className="text-slate-400">--.----° N, --.----° E</span>
        )}
        <div className="h-3 w-px bg-slate-700"></div>
        <div className="flex items-center gap-1 text-slate-300">
          <span>{t.elevation}</span>
          <span className="font-bold text-emerald-300">340m - 1200m</span>
        </div>
      </div>

      {/* Map Legend Overlay (Bottom Left) */}
      <div className="hidden md:flex flex-col gap-1.5 absolute bottom-3 left-3 rtl:left-auto rtl:right-3 z-20 bg-white/95 backdrop-blur-md p-2.5 rounded-lg shadow-md border border-[#D1DCE5] text-[11px]">
        <div className="font-bold text-slate-800 text-xs flex items-center gap-1 mb-0.5">
          <Info className="w-3.5 h-3.5 text-[#006BB2]" />
          <span>{lang === 'ar' ? 'دليل رموز الخريطة الجغرافية' : 'Map Layers Legend'}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#009600]"></span>
            <span>{lang === 'ar' ? 'الخط البيئي والمحميات' : 'Baseline / Reserves'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006BB2]"></span>
            <span>{lang === 'ar' ? 'الموارد المائية والأحواض' : 'Water / Aquifers'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#57B039]"></span>
            <span>{lang === 'ar' ? 'الغطاء النباتي (NDVI)' : 'Vegetation / NDVI'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]"></span>
            <span>{lang === 'ar' ? 'التدهور والتعرية' : 'Soil Degradation'}</span>
          </div>
        </div>
      </div>

    </div>
  );
};
