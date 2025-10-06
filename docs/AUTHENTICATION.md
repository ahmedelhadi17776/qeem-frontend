# 🔐 Frontend Authentication System

> **Complete authentication system documentation for Qeem Frontend**

## 🌟 Overview

The Qeem frontend implements a comprehensive client-side authentication system with React Context, route protection, form handling, and seamless integration with the backend API. This system provides a smooth user experience while maintaining security best practices.

## 🏗️ Architecture

### **Authentication Components**

```
Frontend Authentication System
├── Context Management
│   ├── AuthContext
│   ├── AuthProvider
│   └── useAuth Hook
├── Route Protection
│   ├── AuthGuard Component
│   ├── Protected Routes
│   └── Redirect Logic
├── Form Management
│   ├── LoginForm
│   ├── RegisterForm
│   └── Form Validation (Zod)
├── API Integration
│   ├── Token Management
│   ├── Request Interceptors
│   └── Error Handling
└── State Management
    ├── User State
    ├── Token Storage
    └── Loading States
```

## 🔧 Core Components

### **AuthContext & Provider**

```typescript
// src/contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
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
        .then(setUser)
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
      const response = await apiClient.login(email, password);
      localStorage.setItem('auth_token', response.access_token);
      apiClient.setToken(response.access_token);
      setToken(response.access_token);

      const userData = await apiClient.getCurrentUser();
      setUser(userData);
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

### **Authentication Guard**

```typescript
// src/components/auth/AuthGuard.tsx
export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="text-text-main dark:text-slate-100">
          Loading authentication...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
```

## 📝 Form Components

### **Login Form**

```typescript
// src/components/auth/LoginForm.tsx
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export function LoginForm() {
  const { login, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setError(null);
    try {
      await login(data.email, data.password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        disabled={loading}
      />
      <Input
        label="Password"
        type="password"
        {...register('password')}
        error={errors.password?.message}
        disabled={loading}
      />

      {error && (
        <div className="p-3 bg-danger/10 border border-danger rounded-md">
          <p className="text-danger text-sm">{error}</p>
        </div>
      )}

      <Button type="submit" loading={loading} className="w-full">
        Login
      </Button>
    </form>
  );
}
```

### **Registration Form**

```typescript
// src/components/auth/RegisterForm.tsx
const registerSchema = z
  .object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export function RegisterForm() {
  const { register: authRegister, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: RegisterFormInputs) => {
    setError(null);
    try {
      await authRegister({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          {...register('first_name')}
          error={errors.first_name?.message}
          disabled={loading}
        />
        <Input
          label="Last Name"
          {...register('last_name')}
          error={errors.last_name?.message}
          disabled={loading}
        />
      </div>

      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        disabled={loading}
      />

      <Input
        label="Password"
        type="password"
        {...register('password')}
        error={errors.password?.message}
        disabled={loading}
      />

      <Input
        label="Confirm Password"
        type="password"
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
        disabled={loading}
      />

      {error && (
        <div className="p-3 bg-danger/10 border border-danger rounded-md">
          <p className="text-danger text-sm">{error}</p>
        </div>
      )}

      <Button type="submit" loading={loading} className="w-full">
        Register
      </Button>
    </form>
  );
}
```

## 🌐 API Integration

### **API Client with Authentication**

```typescript
// src/lib/api.ts
export class ApiClient {
  private baseURL: string;
  private token?: string;

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

    // Handle authentication errors
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

  async register(userData: RegisterData): Promise<User> {
    return this.request<User>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/api/v1/auth/me');
  }

  // Rate calculation (requires authentication)
  async calculateRate(data: RateRequest): Promise<RateResponse> {
    return this.request<RateResponse>('/api/v1/rates/calculate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}
```

## 🛡️ Route Protection

### **Protected Routes Implementation**

```typescript
// src/app/(app)/calculator/page.tsx
export default function CalculatorPage() {
  return (
    <AuthGuard>
      <RateCalculatorForm />
    </AuthGuard>
  );
}

// src/app/(app)/layout.tsx
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg dark:bg-slate-900">
      <Header />
      <div className="lg:pl-70">
        <Sidebar />
        <main className="px-4 lg:px-8 py-8 pb-20 lg:pb-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### **Header with Authentication State**

```typescript
// src/components/layouts/Header.tsx
export function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="bg-surface dark:bg-slate-800 border-b border-border dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/brand/qeem-mark.svg"
                alt="Qeem"
                width={32}
                height={32}
                className="dark:hidden"
              />
              <Image
                src="/brand/qeem-mark-light.svg"
                alt="Qeem"
                width={32}
                height={32}
                className="hidden dark:block"
              />
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-text-body dark:text-slate-300">
                  {user?.email}
                </span>
                <Button
                  variant="ghost"
                  onClick={logout}
                  className="text-text-body dark:text-slate-300"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link href="/auth">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
```

## 🔄 Authentication Flow

### **Complete User Journey**

```
1. User visits protected route (/calculator)
   ↓
2. AuthGuard checks authentication state
   ↓
3. If not authenticated → Redirect to /auth
   ↓
4. User sees login/register forms
   ↓
5. User submits login form
   ↓
6. Frontend sends POST /auth/login
   ↓
7. Backend validates credentials
   ↓
8. Backend returns JWT token
   ↓
9. Frontend stores token in localStorage
   ↓
10. AuthContext updates state
    ↓
11. User redirected to /calculator
    ↓
12. Protected route renders with user context
```

### **Token Persistence**

```typescript
// Automatic token restoration on app startup
useEffect(() => {
  const storedToken = localStorage.getItem('auth_token');
  if (storedToken) {
    apiClient.setToken(storedToken);
    // Validate token by fetching user data
    apiClient
      .getCurrentUser()
      .then(setUser)
      .catch(() => {
        // Token invalid, clear it
        localStorage.removeItem('auth_token');
        apiClient.clearToken();
      });
  }
}, []);
```

## 🎨 UI/UX Features

### **Authentication Page**

```typescript
// src/app/auth/page.tsx
export default function AuthPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'register') {
      setActiveTab('register');
    } else {
      setActiveTab('login');
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg dark:bg-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('login')}
              className={`text-lg font-semibold pb-2 border-b-2 ${
                activeTab === 'login'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-muted dark:text-slate-400'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`text-lg font-semibold pb-2 border-b-2 ${
                activeTab === 'register'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-muted dark:text-slate-400'
              }`}
            >
              Register
            </button>
          </div>
        </CardHeader>
        <CardBody>
          {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
        </CardBody>
      </Card>
    </div>
  );
}
```

### **Loading States**

```typescript
// Loading indicators during authentication
if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
    </div>
  );
}
```

## 🔒 Security Considerations

### **Token Storage**

- **localStorage**: Used for token persistence
- **Automatic cleanup**: Tokens cleared on logout or expiration
- **Validation**: Tokens validated on app startup

### **Error Handling**

```typescript
// Comprehensive error handling
try {
  await apiClient.calculateRate(data);
} catch (error) {
  if (error.message === 'Authentication required') {
    // Already handled by API client
    return;
  }

  // Show user-friendly error message
  setError(handleApiError(error));
}
```

### **Form Validation**

- **Client-side validation**: Zod schemas for immediate feedback
- **Server-side validation**: Backend validation as final check
- **Error display**: User-friendly error messages

## 🧪 Testing

### **Authentication Tests**

```typescript
// Component testing
describe('AuthGuard', () => {
  it('redirects unauthenticated users to login', () => {
    render(<AuthGuard><div>Protected Content</div></AuthGuard>);
    expect(mockPush).toHaveBeenCalledWith('/auth');
  });

  it('renders children for authenticated users', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
    });

    render(<AuthGuard><div>Protected Content</div></AuthGuard>);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});

// Hook testing
describe('useAuth', () => {
  it('handles login successfully', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeDefined();
  });
});
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

### **Provider Setup**

```typescript
// src/app/providers.tsx
export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

## 🚀 Future Enhancements

### **Planned Features**

1. **Remember Me** - Extended token expiration
2. **Social Login** - Google, GitHub OAuth
3. **Two-Factor Authentication** - 2FA support
4. **Password Reset** - Forgot password flow
5. **Session Management** - Multiple device support
6. **Offline Support** - Service worker caching

### **Performance Improvements**

1. **Lazy Loading** - Dynamic imports for auth components
2. **Token Refresh** - Automatic token renewal
3. **Optimistic Updates** - Immediate UI updates
4. **Error Boundaries** - Better error handling

## 📚 Related Documentation

- [Backend Authentication](../qeem-backend/docs/AUTHENTICATION.md)
- [API Integration Guide](./API_INTEGRATION.md)
- [Component Library](./COMPONENT_LIBRARY.md)
- [State Management](./STATE_MANAGEMENT.md)

---

<div align="center">
  <strong>🔐 Seamless Frontend Authentication</strong>
  <br>
  <em>Secure, user-friendly, and developer-friendly</em>
</div>
