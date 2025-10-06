'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input, Card, CardHeader, CardBody } from '@/components/ui';
import { handleApiError } from '@/lib/api';

const registerSchema = z
  .object({
    first_name: z.string().min(1, 'First name is required').max(100, 'First name is too long'),
    last_name: z.string().min(1, 'Last name is required').max(100, 'Last name is too long'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await registerUser({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
      });
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <h1 className="text-3xl font-extrabold text-text-main dark:text-slate-100 mb-2">Join Qeem</h1>
        <p className="text-text-body dark:text-slate-300">Create your account to get started</p>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              {...register('first_name')}
              error={errors.first_name?.message}
              placeholder="John"
            />

            <Input label="Last Name" {...register('last_name')} error={errors.last_name?.message} placeholder="Doe" />
          </div>

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
            placeholder="Create a strong password"
          />

          <Input
            label="Confirm Password"
            type="password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
            placeholder="Confirm your password"
          />

          {error && (
            <div className="p-3 bg-danger/10 border border-danger rounded-md">
              <p className="text-danger text-sm">{error}</p>
            </div>
          )}

          <Button type="submit" loading={isLoading} className="w-full">
            Create Account
          </Button>

          {onSwitchToLogin && (
            <div className="text-center">
              <p className="text-text-muted dark:text-slate-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-accent hover:text-accent-dark font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}
        </form>
      </CardBody>
    </Card>
  );
}
