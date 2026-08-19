import { GeoPointRecord, SpatialLayerConfig } from '../types';
import { INITIAL_LAYERS, INITIAL_GEO_POINTS } from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const layerService = {
  async getLayers(): Promise<SpatialLayerConfig[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/layers/`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return Array.isArray(data) && data.length ? data : INITIAL_LAYERS;
    } catch (err) {
      console.warn('API unavailable. Using fallback mock layers:', err);
      return INITIAL_LAYERS;
    }
  },
};

export const observationService = {
  async getObservations(): Promise<GeoPointRecord[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/observations/`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return data.results ? data.results : data;
    } catch (err) {
      console.warn('API unavailable. Using fallback mock observations:', err);
      return INITIAL_GEO_POINTS;
    }
  },

  async createObservation(record: GeoPointRecord): Promise<GeoPointRecord> {
    try {
      const res = await fetch(`${API_BASE_URL}/observations/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Offline mode: saving observation locally.', err);
      return record;
    }
  },
};