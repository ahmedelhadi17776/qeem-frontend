import {
  RateRequest,
  RateResponse,
  AuthResponse,
  User,
  ApiError,
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

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
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
  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
  }): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/v1/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/api/v1/auth/me');
  }

  // Rate Calculator
  async calculateRate(data: RateRequest): Promise<RateResponse> {
    return this.request<RateResponse>('/api/v1/rates/calculate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getRateHistory(): Promise<RateResponse[]> {
    return this.request<RateResponse[]>('/api/v1/rates/history');
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
