'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient, handleApiError } from '@/lib/api';
import { Button, Input, Card, CardHeader, CardBody } from '@/components/ui';

const resendSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ResendFormData = z.infer<typeof resendSchema>;

interface ResendVerificationProps {
  onSuccess?: () => void;
  className?: string;
}

export function ResendVerification({ onSuccess, className }: ResendVerificationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendFormData>({
    resolver: zodResolver(resendSchema),
  });

  const onSubmit = async (data: ResendFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.resendVerificationEmail(data.email);
      setSuccess(true);
      onSuccess?.();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">📧</span>
            </div>
            <h3 className="text-lg font-semibold text-text-main dark:text-slate-100 mb-2">Verification Email Sent</h3>
            <p className="text-sm text-text-body dark:text-slate-300">
              Please check your email and click the verification link to activate your account.
            </p>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <h3 className="text-lg font-semibold text-text-main dark:text-slate-100 mb-2">Resend Verification Email</h3>
        <p className="text-sm text-text-body dark:text-slate-300">
          Enter your email address to receive a new verification link.
        </p>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            placeholder="your@email.com"
          />

          {error && (
            <div className="p-3 bg-danger/10 border border-danger rounded-md">
              <p className="text-danger text-sm">{error}</p>
            </div>
          )}

          <Button type="submit" loading={isLoading} className="w-full">
            Send Verification Email
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
