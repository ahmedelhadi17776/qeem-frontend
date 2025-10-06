'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input, Card, CardHeader, CardBody } from '@/components/ui';
import { handleApiError } from '@/lib/api';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await login(data.email, data.password);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <h1 className="text-3xl font-extrabold text-text-main dark:text-slate-100 mb-2">Welcome Back</h1>
        <p className="text-text-body dark:text-slate-300">Sign in to your Qeem account</p>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            placeholder="your@email.com"
          />

          <Input
            label="Password"
            type="password"
            {...register('password')}
            error={errors.password?.message}
            placeholder="Enter your password"
          />

          {error && (
            <div className="p-3 bg-danger/10 border border-danger rounded-md">
              <p className="text-danger text-sm">{error}</p>
            </div>
          )}

          <Button type="submit" loading={isLoading} className="w-full">
            Sign In
          </Button>

          {onSwitchToRegister && (
            <div className="text-center">
              <p className="text-text-muted dark:text-slate-400">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-accent hover:text-accent-dark font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>
          )}
        </form>
      </CardBody>
    </Card>
  );
}
