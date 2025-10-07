import {
  RateRequest,
  RateResponse,
  User,
  UserProfile,
  ApiError,
  TokenResponse,
  RateHistoryResponse,
  MarketStatisticsQuery,
  MarketStatisticsResponse,
  MarketTrendsQuery,
  MarketTrendsResponse,
} from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export class ApiClient {
  private baseURL: string;
  private token?: string;
  private refreshToken?: string;
  private isRefreshing = false;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  setToken(token: string) {
    this.token = token;
  }

  setRefreshToken(refreshToken: string) {
    this.refreshToken = refreshToken;
  }

  clearToken() {
    this.token = undefined;
    this.refreshToken = undefined;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 errors with automatic token refresh
    if (response.status === 401 && this.refreshToken && !this.isRefreshing) {
      try {
        this.isRefreshing = true;
        const refreshed = await this.refreshAccessToken();

        if (refreshed) {
          // Retry the original request with new token
          const retryHeaders: HeadersInit = {
            'Content-Type': 'application/json',
            ...(this.token && { Authorization: `Bearer ${this.token}` }),
            ...options.headers,
          };

          const retryResponse = await fetch(url, {
            ...options,
            headers: retryHeaders,
          });

          if (retryResponse.ok) {
            return retryResponse.json();
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      } finally {
        this.isRefreshing = false;
      }
    }

    if (!response.ok) {
      // Handle 401/403 authentication errors
      if (response.status === 401 || response.status === 403) {
        // Clear invalid tokens
        this.clearToken();
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');

        // Redirect to login page if we're in the browser
        if (typeof window !== 'undefined') {
          window.location.href = '/auth';
        }
      }

      const errorData = await response.json().catch(() => ({}));
      const error: ApiError = {
        message: errorData.message ?? `API Error: ${response.statusText}`,
        code: errorData.code ?? `HTTP_${response.status}`,
        details: errorData.details,
      };
      throw error;
    }

    return response.json();
  }

  // Authentication
  async login(email: string, password: string): Promise<TokenResponse> {
    return this.request<TokenResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: { email: string; password: string; first_name: string; last_name: string }): Promise<User> {
    return this.request<User>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseURL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: this.refreshToken }),
      });

      if (response.ok) {
        const tokenData: TokenResponse = await response.json();
        this.setToken(tokenData.access_token);
        this.setRefreshToken(tokenData.refresh_token);

        // Update localStorage
        localStorage.setItem('auth_token', tokenData.access_token);
        localStorage.setItem('refresh_token', tokenData.refresh_token);

        return true;
      }
    } catch (error) {
      console.error('Refresh token request failed:', error);
    }

    return false;
  }

  async logout(): Promise<void> {
    if (this.refreshToken) {
      try {
        await fetch(`${this.baseURL}/api/v1/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: this.refreshToken }),
        });
      } catch (error) {
        console.error('Logout request failed:', error);
      }
    }

    // Clear tokens regardless of API call success
    this.clearToken();
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/api/v1/auth/me');
  }

  // Email verification
  async verifyEmail(token: string): Promise<{ message: string; user_id: number }> {
    return this.request<{ message: string; user_id: number }>('/api/v1/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/v1/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async getUserProfile(): Promise<UserProfile> {
    return this.request<UserProfile>('/api/v1/users/profile');
  }

  async updateUserProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    return this.request<UserProfile>('/api/v1/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Rate Calculator
  async calculateRate(data: RateRequest): Promise<RateResponse> {
    return this.request<RateResponse>('/api/v1/rates/calculate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getRateHistory(): Promise<RateHistoryResponse> {
    return this.request<RateHistoryResponse>('/api/v1/rates/history');
  }

  // Market Data
  async getMarketStatistics(query: MarketStatisticsQuery): Promise<MarketStatisticsResponse> {
    const params = new URLSearchParams();

    if (query.project_type) params.append('project_type', query.project_type);
    if (query.location) params.append('location', query.location);
    if (query.period_type) params.append('period_type', query.period_type);
    if (query.date_from) params.append('date_from', query.date_from);
    if (query.date_to) params.append('date_to', query.date_to);
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.offset) params.append('offset', query.offset.toString());

    const queryString = params.toString();
    const endpoint = `/api/v1/market/statistics${queryString ? `?${queryString}` : ''}`;

    return this.request<MarketStatisticsResponse>(endpoint);
  }

  async getMarketTrends(query: MarketTrendsQuery): Promise<MarketTrendsResponse> {
    const params = new URLSearchParams();

    if (query.project_type) params.append('project_type', query.project_type);
    if (query.location) params.append('location', query.location);
    if (query.period_type) params.append('period_type', query.period_type);
    if (query.window) params.append('window', query.window.toString());

    const queryString = params.toString();
    const endpoint = `/api/v1/market/trends${queryString ? `?${queryString}` : ''}`;

    return this.request<MarketTrendsResponse>(endpoint);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Helper function to handle API errors
export function handleApiError(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as ApiError).message;
  }
  return 'An unexpected error occurred';
}
