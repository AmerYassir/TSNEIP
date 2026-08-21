export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Observation {
  id: number;
  title: string;
  description: string;
  category: string;
  status: 'draft' | 'approved' | 'rejected';
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  created_at: string;
  updated_at: string;
  observer: number;
}

export interface ObservationFilterParams {
  page?: number;
  page_size?: number;
  category?: string;
  status?: string;
  search?: string;
}