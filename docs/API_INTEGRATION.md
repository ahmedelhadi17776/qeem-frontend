# 🔗 API Integration Documentation

> **Complete guide for integrating Qeem Frontend with Backend API**

## 🌟 Overview

This document provides comprehensive documentation for integrating the Qeem frontend with the backend API. It covers authentication, API communication, error handling, and best practices for seamless integration.

## 🏗️ Integration Architecture

### **API Client Structure**

```
Frontend API Integration
├── API Client (api.ts)
│   ├── Authentication Methods
│   ├── Rate Calculation Methods
│   ├── User Management Methods
│   └── Error Handling
├── Type Definitions (types/api.ts)
│   ├── Request Types
│   ├── Response Types
│   └── Error Types
├── Authentication Context
│   ├── Token Management
│   ├── State Synchronization
│   └── Route Protection
└── Error Handling
    ├── API Error Detection
    ├── User-Friendly Messages
    └── Automatic Redirects
```

## 🔧 API Client Implementation

### **Core API Client**

```typescript
// src/lib/api.ts
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
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle authentication errors globally
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('auth_token');
      this.clearToken();
      window.location.href = '/auth';
      throw new Error('Authentication required');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Authentication methods
  async login(email: string, password: string): Promise<TokenResponse> {
    return this.request<TokenResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: RegisterRequest): Promise<User> {
    return this.request<User>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/api/v1/auth/me');
  }

  // Rate calculation methods
  async calculateRate(data: RateRequest): Promise<RateResponse> {
    return this.request<RateResponse>('/api/v1/rates/calculate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getRateHistory(): Promise<RateHistoryResponse> {
    return this.request<RateHistoryResponse>('/api/v1/rates/history');
  }
}

export const apiClient = new ApiClient();
```

## 🔐 Authentication Integration

### **Authentication Context**

```typescript
// src/contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Token persistence and validation
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      apiClient.setToken(storedToken);
      setToken(storedToken);

      // Validate token by fetching user data
      apiClient.getCurrentUser()
        .then((userData) => setUser(userData))
        .catch(() => {
          // Token invalid, clear it
          localStorage.removeItem('auth_token');
          apiClient.clearToken();
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const response: TokenResponse = await apiClient.login(email, password);

      // Store token
      localStorage.setItem('auth_token', response.access_token);
      apiClient.setToken(response.access_token);
      setToken(response.access_token);

      // Fetch user details
      const userData = await apiClient.getCurrentUser();
      setUser(userData);

      // Redirect to protected route
      router.push('/calculator');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    apiClient.clearToken();
    setToken(null);
    setUser(null);
    router.push('/auth');
  }, [router]);

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{
      user, token, isAuthenticated, loading, login, register, logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}
```

## 📝 Type Definitions

### **API Types**

```typescript
// src/types/api.ts

// Authentication Types
export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

// Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

// Rate Calculation Types
export interface RateRequest {
  project_type: 'web_development' | 'mobile_development' | 'data_science' | 'design';
  project_complexity: 'simple' | 'moderate' | 'complex';
  estimated_hours: number;
  experience_years: number;
  skills_count: number;
  client_region: 'cairo' | 'alexandria' | 'giza' | 'other';
  urgency: 'low' | 'medium' | 'high';
}

export interface RateResponse {
  minimum_rate: number;
  competitive_rate: number;
  premium_rate: number;
  currency: 'EGP';
  method: 'rule_based' | 'ml_prediction';
  rationale: string;
}

export interface RateHistoryResponse {
  items: RateResponse[];
}
```

## 🔄 API Usage Examples

### **Authentication Flow**

```typescript
// Login example
const handleLogin = async (email: string, password: string) => {
  try {
    await login(email, password);
    // User is automatically redirected to /calculator
  } catch (error) {
    setError('Login failed. Please check your credentials.');
  }
};

// Registration example
const handleRegister = async (userData: RegisterRequest) => {
  try {
    await register(userData);
    // User is automatically logged in and redirected
  } catch (error) {
    setError('Registration failed. Please try again.');
  }
};
```

### **Rate Calculation**

```typescript
// Rate calculation example
const calculateRate = async (data: RateRequest) => {
  try {
    const result = await apiClient.calculateRate(data);
    setResults(result);
  } catch (error) {
    setError('Rate calculation failed. Please try again.');
  }
};

// Rate history example
const loadRateHistory = async () => {
  try {
    const history = await apiClient.getRateHistory();
    setHistory(history.items);
  } catch (error) {
    console.error('Failed to load rate history:', error);
  }
};
```

## 🛡️ Error Handling

### **Error Handling Utility**

```typescript
// src/lib/api.ts
export function handleApiError(error: any): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error.detail) {
    return error.detail;
  }

  return 'An unexpected error occurred';
}
```

### **Error Handling in Components**

```typescript
// Component error handling example
const [error, setError] = useState<string | null>(null);

const handleSubmit = async (data: RateRequest) => {
  setError(null);
  try {
    const result = await apiClient.calculateRate(data);
    setResults(result);
  } catch (error) {
    setError(handleApiError(error));
  }
};

// Display error in UI
{error && (
  <div className="p-3 bg-danger/10 border border-danger rounded-md">
    <p className="text-danger text-sm">{error}</p>
  </div>
)}
```

## 🔧 Configuration

### **Environment Variables**

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ENABLE_DEVTOOLS=true
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=false
NEXT_TELEMETRY_DISABLED=1
```

### **API Client Configuration**

```typescript
// src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class ApiClient {
  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }
}
```

## 🧪 Testing API Integration

### **API Client Testing**

```typescript
// src/__tests__/api.test.ts
import { apiClient } from '@/lib/api';

describe('API Client', () => {
  beforeEach(() => {
    apiClient.clearToken();
  });

  it('should login with valid credentials', async () => {
    const { access_token } = await apiClient.login('test@example.com', 'password123');
    expect(access_token).toBeDefined();
    expect(typeof access_token).toBe('string');
  });

  it('should calculate rate with authentication', async () => {
    // First login
    await apiClient.login('test@example.com', 'password123');

    const rateData: RateRequest = {
      project_type: 'web_development',
      project_complexity: 'moderate',
      estimated_hours: 40,
      experience_years: 3,
      skills_count: 5,
      client_region: 'cairo',
      urgency: 'medium',
    };

    const result = await apiClient.calculateRate(rateData);
    expect(result.minimum_rate).toBeGreaterThan(0);
    expect(result.currency).toBe('EGP');
  });
});
```

### **Authentication Context Testing**

```typescript
// src/__tests__/AuthContext.test.tsx
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

describe('AuthContext', () => {
  it('should handle login successfully', async () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeDefined();
  });
});
```

## 🚀 Performance Optimization

### **Request Optimization**

```typescript
// Debounced API calls
import { useDebounce } from '@/hooks/useDebounce';

const debouncedSearch = useDebounce(searchTerm, 300);

useEffect(() => {
  if (debouncedSearch) {
    searchUsers(debouncedSearch);
  }
}, [debouncedSearch]);
```

### **Caching Strategy**

```typescript
// React Query integration
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useRateCalculation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: RateRequest) => apiClient.calculateRate(data),
    onSuccess: data => {
      // Invalidate and refetch rate history
      queryClient.invalidateQueries({ queryKey: ['rateHistory'] });
    },
  });

  return mutation;
}

export function useRateHistory() {
  return useQuery({
    queryKey: ['rateHistory'],
    queryFn: () => apiClient.getRateHistory(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

## 📚 Related Documentation

- [Backend API Documentation](../qeem-backend/docs/API.md)
- [Authentication Documentation](AUTHENTICATION.md)
- [Frontend-Backend Integration Guide](../qeem-meta/docs/development/frontend-backend-integration.md)
- [API Endpoints Reference](../qeem-meta/docs/api/auth-endpoints.md)

---

<div align="center">
  <strong>🔗 Seamless API Integration</strong>
  <br>
  <em>Robust, type-safe, and developer-friendly</em>
</div>
