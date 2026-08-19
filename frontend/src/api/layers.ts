import apiClient from './client';

export interface MapLayer {
  id: number;
  name: string;
  category: string;
  is_visible: boolean;
  opacity: number;
  geojson_url?: string;
  metadata?: Record<string, unknown>;
}

export interface LayerCategory {
  id: number;
  name: string;
  slug: string;
}

export const layersApi = {
  listLayers: () => apiClient.get<MapLayer[]>('layers/'),
  listCategories: () => apiClient.get<LayerCategory[]>('layers/categories/'),
  getLayerData: (layerId: number | string) =>
    apiClient.get<GeoJSON.FeatureCollection>(`layers/${layerId}/geojson/`),
};