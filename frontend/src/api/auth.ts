import apiClient from './client';
import { AuthTokens, User } from './types';

export const authApi = {
  login: (credentials: { username: string; password: string }) => {
    return apiClient.post<AuthTokens>('token/', credentials);
  },

  refreshToken: (refresh: string) => {
    return apiClient.post<{ access: string }>('token/refresh/', { refresh });
  },

  getCurrentUser: () => {
    return apiClient.get<User>('auth/me/');
  },
};