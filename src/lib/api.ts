import {
  RateRequest,
  RateResponse,
  User,
  UserProfile,
  ApiError,
  TokenResponse,
  RateHistoryResponse,
} from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export class ApiClient {
  private baseURL: string;
  private token?: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = undefined;
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

    if (!response.ok) {
      // Handle 401/403 authentication errors
      if (response.status === 401 || response.status === 403) {
        // Clear invalid token
        this.clearToken();
        localStorage.removeItem('auth_token');

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

  // Note: Refresh token endpoint not implemented in backend yet
  // async refreshToken(refreshToken: string): Promise<TokenResponse> {
  //   return this.request<TokenResponse>('/api/v1/auth/refresh', {
  //     method: 'POST',
  //     body: JSON.stringify({ refresh_token: refreshToken }),
  //   });
  // }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/api/v1/auth/me');
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
