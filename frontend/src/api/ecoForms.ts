import apiClient from './client';

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'geo_point';
  required: boolean;
  options?: string[];
}

export interface EcoFormSchema {
  id: number;
  title: string;
  description: string;
  fields: FormField[];
}

export const ecoFormsApi = {
  listForms: () => apiClient.get<EcoFormSchema[]>('eco-forms/'),
  getFormById: (id: number | string) => apiClient.get<EcoFormSchema>(`eco-forms/${id}/`),
  submitResponse: (formId: number | string, payload: Record<string, unknown>) =>
    apiClient.post<{ id: number; status: string }>(`eco-forms/${formId}/submit/`, payload),
};