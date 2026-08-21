const API_BASE_URL = (import.meta.env?.VITE_API_URL as string | undefined) || 'http://localhost:8000';

const getCsrfToken = (): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|; )csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('access_token');
};

type RequestOptions<TBody = unknown> = Omit<RequestInit, 'body'> & {
  body?: TBody;
  params?: Record<string, string | number | boolean | null | undefined>;
  headers?: Record<string, string>;
};

const buildUrl = (endpoint: string, params?: Record<string, string | number | boolean | null | undefined>) => {
  const cleanBase = API_BASE_URL.replace(/\/+$/, '');
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  const url = new URL(`${cleanBase}/${cleanEndpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
};

async function request<TResponse>(endpoint: string, options: RequestOptions = {}): Promise<TResponse> {
  const { body, params, headers = {}, ...rest } = options;
  const token = getAuthToken();
  const csrfToken = getCsrfToken();

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const config: RequestInit = {
    ...rest,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(!isFormData && body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
  };

  if (body !== undefined) {
    config.body = isFormData ? (body as FormData) : JSON.stringify(body);
  }

  const response = await fetch(buildUrl(endpoint, params), config);

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json().catch(() => null)
    : await response.text();

  if (!response.ok) {
    const message =
      (payload && typeof payload === 'object' && 'detail' in payload && typeof payload.detail === 'string'
        ? payload.detail
        : payload && typeof payload === 'object' && 'message' in payload && typeof payload.message === 'string'
          ? payload.message
          : null) || `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return payload as TResponse;
}

export const apiClient = {
  get<TResponse>(endpoint: string, params?: Record<string, string | number | boolean | null | undefined>, init?: Omit<RequestOptions, 'body' | 'params'>) {
    return request<TResponse>(endpoint, { ...init, method: 'GET', params });
  },

  post<TResponse, TBody = unknown>(endpoint: string, body?: TBody, init?: Omit<RequestOptions<TBody>, 'body'>) {
    return request<TResponse>(endpoint, { ...init, method: 'POST', body });
  },

  put<TResponse, TBody = unknown>(endpoint: string, body?: TBody, init?: Omit<RequestOptions<TBody>, 'body'>) {
    return request<TResponse>(endpoint, { ...init, method: 'PUT', body });
  },

  patch<TResponse, TBody = unknown>(endpoint: string, body?: TBody, init?: Omit<RequestOptions<TBody>, 'body'>) {
    return request<TResponse>(endpoint, { ...init, method: 'PATCH', body });
  },

  delete<TResponse>(endpoint: string, params?: Record<string, string | number | boolean | null | undefined>, init?: Omit<RequestOptions, 'body' | 'params'>) {
    return request<TResponse>(endpoint, { ...init, method: 'DELETE', params });
  },
};

export default apiClient;
