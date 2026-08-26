import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authApi, authStorage } from '../services/api';
import { UserProfile } from '../types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (payload: {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    organization?: string;
    role?: string;
  }) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // On mount: restore session from token if present
  useEffect(() => {
    const token = authStorage.getAccessToken();

    if (token) {
      authApi.getMe()
        .then((profile) => setUser(profile))
        .catch((err: any) => {
          // Only wipe tokens if the server explicitly rejected them (401)
          if (err.status === 401) {
            authStorage.clearAuth();
          }
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.login(credentials);
      const profile = await authApi.getMe();
      setUser(profile);
    } catch (err: any) {
      const msg = err.message || 'Authentication failed';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    organization?: string;
    role?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.register(payload);
      // Auto-login after register using email
      await login({ email: payload.email, password: payload.password });
    } catch (err: any) {
      const msg = err.message || 'Registration failed';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};