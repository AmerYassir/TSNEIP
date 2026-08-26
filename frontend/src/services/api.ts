/**
 * TSNEIP GIS Platform - Backend API Service Layer
 * Directly interfaces with Django REST Framework backend endpoints.
 */

import {
  GeoObservation,
  GeoObservationCreatePayload,
  ObservationSubdomain,
  GeoJsonPaginationResponse,
  GeoObservationGeoFeature,
  SurveyForm,
  FormSubmission,
  FormSubmissionCreatePayload,
  SDGGoal,
  EcosystemThreatCategory,
  Organization,
  Article,
  ArticleCategory,
  Publication,
  AnalyticsSummary,
  SdgReport,
  AdministrativeUnit,
  UserProfile,
  AuthTokens,
} from '../types';

const API_BASE = ((import.meta as any).env?.VITE_API_BASE_URL as string) || '/api/v1';

// Token Storage Keys — unified to 'access_token' so api/client.ts can read it
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_PROFILE_KEY = 'tsneip_user_profile';

export const authStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  getUser(): UserProfile | null {
    const raw = localStorage.getItem(USER_PROFILE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setAuth(tokens: AuthTokens): void {
    if (tokens.access) localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
    if (tokens.refresh) localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
    if (tokens.user) localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(tokens.user));
  },
  clearAuth(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_PROFILE_KEY);
  },
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },
};

/**
 * Low-level HTTP request helper with automatic JWT injection and error extraction
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  console.log('[API Request]', {
    endpoint,
    url,
    hasToken: !!authStorage.getAccessToken(),
    tokenPreview: authStorage.getAccessToken()?.slice(0, 20) + '...',
  });

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  const token = authStorage.getAccessToken();
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  // Handle Token Expiry / 401 Attempt Refresh
  if (response.status === 401 && authStorage.getRefreshToken()) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${authStorage.getAccessToken()}`;
      const retryResponse = await fetch(url, { ...config, headers });
      if (retryResponse.ok) {
        if (retryResponse.status === 204) return {} as T;
        return (await retryResponse.json()) as T;
      }
    }
  }

  if (!response.ok) {
    let errorData: any;
    try {
      errorData = await response.json();
    } catch {
      errorData = { detail: response.statusText || 'Server error' };
    }
    const errorMessage = 
      errorData.detail || 
      errorData.error || 
      (typeof errorData === 'object' ? JSON.stringify(errorData) : 'Request failed');
    const err = new Error(errorMessage);
    (err as any).status = response.status;
    (err as any).data = errorData;
    throw err;
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

async function tryRefreshToken(): Promise<boolean> {
  const refresh = authStorage.getRefreshToken();
  if (!refresh) return false;

  try {
    const res = await fetch(`${API_BASE}/users/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.access) {
        localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
        return true;
      }
    }
  } catch {
    // refresh failed
  }
  authStorage.clearAuth();
  return false;
}

// -------------------------------------------------------------
// 1. Authentication API
// -------------------------------------------------------------
export const authApi = {
  async login(credentials: { email: string; password: string }): Promise<AuthTokens> {
    const data = await request<AuthTokens>('/users/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    authStorage.setAuth(data);
    return data;
  },

  async register(payload: {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    organization?: string;
    role?: string;
  }): Promise<UserProfile> {
    return request<UserProfile>('/users/register/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getMe(): Promise<UserProfile> {
    return request<UserProfile>('/users/me/');
  },

  logout(): void {
    authStorage.clearAuth();
  },
};

// -------------------------------------------------------------
// 2. Observations API
// -------------------------------------------------------------
export const observationsApi = {
  async list(params?: {
    search?: string;
    ordering?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ count?: number; results?: GeoObservation[] } | GeoObservation[]> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.ordering) query.set('ordering', params.ordering);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.offset) query.set('offset', String(params.offset));

    const qs = query.toString();
    return request(`/observations/${qs ? `?${qs}` : ''}`);
  },

  async get(id: string): Promise<GeoObservation> {
    return request<GeoObservation>(`/observations/${id}/`);
  },

  async getMapFeatures(): Promise<GeoJsonPaginationResponse<GeoObservationGeoFeature>> {
    return request<GeoJsonPaginationResponse<GeoObservationGeoFeature>>('/observations/map/');
  },

  async getSubdomains(domain?: string): Promise<ObservationSubdomain[]> {
    const qs = domain ? `?domain=${encodeURIComponent(domain)}` : '';
    const res = await request<any>(`/observations/subdomains/${qs}`);
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.results)) return res.results;
    return [];
  },

  async create(payload: GeoObservationCreatePayload): Promise<GeoObservation> {
    return request<GeoObservation>('/observations/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async claim(id: string): Promise<{ status: string; reviewed_by: string }> {
    return request(`/observations/${id}/claim/`, { method: 'POST' });
  },

  async approve(id: string): Promise<{ status: string }> {
    return request(`/observations/${id}/approve/`, { method: 'POST' });
  },

  async reject(id: string, reason: string): Promise<{ status: string; rejection_reason: string }> {
    return request(`/observations/${id}/reject/`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },
};

// -------------------------------------------------------------
// 3. Surveys & Dynamic Forms API
// -------------------------------------------------------------
export const surveysApi = {
  async getActiveForms(): Promise<SurveyForm[]> {
    try {
      const res = await request<any>('/surveys/forms/active/');
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.results)) return res.results;
    } catch {
      // fallback to standard list
    }
    const fallback = await request<any>('/surveys/forms/?is_active=true');
    if (Array.isArray(fallback)) return fallback;
    if (fallback && Array.isArray(fallback.results)) return fallback.results;
    return [];
  },

  async getFormBySlug(slug: string): Promise<SurveyForm> {
    return request<SurveyForm>(`/surveys/forms/${slug}/`);
  },

  async getSubmissions(params?: { form?: string; status?: string }): Promise<any> {
    const query = new URLSearchParams();
    if (params?.form) query.set('form', params.form);
    if (params?.status) query.set('status', params.status);
    const qs = query.toString();
    return request(`/surveys/submissions/${qs ? `?${qs}` : ''}`);
  },

  async submitForm(payload: FormSubmissionCreatePayload): Promise<FormSubmission> {
    return request<FormSubmission>('/surveys/submissions/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async approveSubmission(id: string): Promise<{ status: string }> {
    return request(`/surveys/submissions/${id}/approve/`, { method: 'POST' });
  },

  async rejectSubmission(id: string): Promise<{ status: string }> {
    return request(`/surveys/submissions/${id}/reject/`, { method: 'POST' });
  },
};

// -------------------------------------------------------------
// 4. Taxonomy & SDGs API
// -------------------------------------------------------------
export const taxonomyApi = {
  async getSDGGoals(): Promise<SDGGoal[]> {
    const res = await request<any>('/taxonomy/sdgs/');
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.results)) return res.results;
    return [];
  },

  async getThreatCategories(): Promise<EcosystemThreatCategory[]> {
    const res = await request<any>('/taxonomy/threat-categories/');
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.results)) return res.results;
    return [];
  },
};

// -------------------------------------------------------------
// 5. Organizations API
// -------------------------------------------------------------
export const organizationsApi = {
  async list(): Promise<Organization[]> {
    const res = await request<any>('/organizations/');
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.results)) return res.results;
    return [];
  },
};

// -------------------------------------------------------------
// 6. Content, Articles & Publications API
// -------------------------------------------------------------
export const contentApi = {
  async getArticles(categorySlug?: string): Promise<Article[]> {
    const qs = categorySlug ? `?category__slug=${encodeURIComponent(categorySlug)}` : '';
    const res = await request<any>(`/content/articles/${qs}`);
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.results)) return res.results;
    return [];
  },

  async getArticle(id: string): Promise<Article> {
    return request<Article>(`/content/articles/${id}/`);
  },

  async getCategories(): Promise<ArticleCategory[]> {
    const res = await request<any>('/content/categories/');
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.results)) return res.results;
    return [];
  },

  async getPublications(): Promise<Publication[]> {
    const res = await request<any>('/content/publications/');
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.results)) return res.results;
    return [];
  },
};

// -------------------------------------------------------------
// 7. Analytics API
// -------------------------------------------------------------
export const analyticsApi = {
  async getSummary(): Promise<AnalyticsSummary> {
    return request<AnalyticsSummary>('/analytics/summary/');
  },
  async getSdgReport(): Promise<SdgReport> {
    return request<SdgReport>('/analytics/sdg-report/');
  },
};

// -------------------------------------------------------------
// 8. Locations / Administrative Units API
// -------------------------------------------------------------
export const locationsApi = {
  async getUnits(): Promise<AdministrativeUnit[]> {
    const res = await request<any>('/locations/units/');
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.results)) return res.results;
    return [];
  },
};

// -------------------------------------------------------------
// 9. Interventions API
// -------------------------------------------------------------
export const interventionsApi = {
  async list(): Promise<any> {
    return request('/interventions/interventions/');
  },
};