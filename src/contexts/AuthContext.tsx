'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { User, TokenResponse } from '@/types/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { email: string; password: string; first_name: string; last_name: string }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        const storedRefreshToken = localStorage.getItem('refresh_token');

        if (storedToken && storedRefreshToken) {
          apiClient.setToken(storedToken);
          apiClient.setRefreshToken(storedRefreshToken);
          setToken(storedToken);
          setRefreshToken(storedRefreshToken);

          // Verify token by fetching current user
          const userData = await apiClient.getCurrentUser();
          setUser(userData);
        }
      } catch {
        // Tokens are invalid, clear them
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        apiClient.clearToken();
        setToken(null);
        setRefreshToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response: TokenResponse = await apiClient.login(email, password);

      // Store both tokens
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      apiClient.setToken(response.access_token);
      apiClient.setRefreshToken(response.refresh_token);
      setToken(response.access_token);
      setRefreshToken(response.refresh_token);

      // Fetch user data
      const userData = await apiClient.getCurrentUser();
      setUser(userData);

      // Clear any cached data from previous user sessions
      queryClient.clear();

      // Redirect to calculator
      router.push('/calculator');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData: { email: string; password: string; first_name: string; last_name: string }) => {
    try {
      await apiClient.register(userData);

      // After successful registration, redirect to verification prompt instead of auto-login
      router.push('/auth/verify-prompt');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Clear state regardless of API call success
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      apiClient.clearToken();
      setToken(null);
      setRefreshToken(null);
      setUser(null);

      // Clear all cached data to prevent data leakage
      queryClient.clear();

      router.push('/');
    }
  };

  const isAuthenticated = !!user && !!token;

  const value = {
    user,
    token,
    refreshToken,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
