import apiClient from './client';
import { Observation, ObservationFilterParams, PaginatedResponse } from './types';

export const observationsApi = {
  list: (params?: ObservationFilterParams) => {
    return apiClient.get<PaginatedResponse<Observation>>('observations/', params);
  },

  getById: (id: number | string) => {
    return apiClient.get<Observation>(`observations/${id}/`);
  },

  create: (data: Partial<Observation>) => {
    return apiClient.post<Observation>('observations/', data);
  },

  update: (id: number | string, data: Partial<Observation>) => {
    return apiClient.patch<Observation>(`observations/${id}/`, data);
  },

  delete: (id: number | string) => {
    return apiClient.delete<{ success: boolean }>(`observations/${id}/`);
  },
};