'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { User, TokenResponse } from '@/types/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { email: string; password: string; first_name: string; last_name: string }) => Promise<void>;
  logout: () => void;
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
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
          apiClient.setToken(storedToken);
          setToken(storedToken);

          // Verify token by fetching current user
          const userData = await apiClient.getCurrentUser();
          setUser(userData);
        }
      } catch {
        // Token is invalid, clear it
        localStorage.removeItem('auth_token');
        apiClient.clearToken();
        setToken(null);
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

      // Store token
      localStorage.setItem('auth_token', response.access_token);
      apiClient.setToken(response.access_token);
      setToken(response.access_token);

      // Fetch user data
      const userData = await apiClient.getCurrentUser();
      setUser(userData);

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

      // After successful registration, automatically log in
      await login(userData.email, userData.password);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    apiClient.clearToken();
    setToken(null);
    setUser(null);
    router.push('/');
  };

  const isAuthenticated = !!user && !!token;

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
