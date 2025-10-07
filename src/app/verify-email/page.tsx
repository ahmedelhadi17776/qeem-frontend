'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui';

// Dynamic imports for better performance
const Card = dynamic(() => import('@/components/ui').then(mod => ({ default: mod.Card })), { ssr: true });
const CardHeader = dynamic(() => import('@/components/ui').then(mod => ({ default: mod.CardHeader })), { ssr: true });
const CardBody = dynamic(() => import('@/components/ui').then(mod => ({ default: mod.CardBody })), { ssr: true });

// Loading component for Suspense fallback
function VerificationLoading() {
  return (
    <div className="min-h-screen bg-bg dark:bg-slate-900 flex items-center justify-center px-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⏳</span>
            </div>
            <h1 className="text-2xl font-bold text-text-main dark:text-slate-100 mb-2">Verifying Email...</h1>
            <p className="text-text-body dark:text-slate-300">Please wait while we verify your email address.</p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4" />
            <p className="text-sm text-text-muted dark:text-slate-400">Verifying...</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// Main verification component that uses useSearchParams
function VerifyEmailContent() {
  type VerificationState = 'loading' | 'success' | 'error' | 'invalid';

  const [state, setState] = useState<VerificationState>('loading');
  const [message, setMessage] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setState('invalid');
        setMessage('No verification token provided');
        return;
      }

      try {
        const result = await apiClient.verifyEmail(token);
        setState('success');
        setMessage(result.message);

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth');
        }, 3000);
      } catch (error) {
        setState('error');
        setMessage(error instanceof Error ? error.message : 'Verification failed');
      }
    };

    verifyEmail();
  }, [token, router]);

  const getIcon = () => {
    switch (state) {
      case 'loading':
        return '⏳';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'invalid':
        return '⚠️';
      default:
        return '❓';
    }
  };

  const getTitle = () => {
    switch (state) {
      case 'loading':
        return 'Verifying Email...';
      case 'success':
        return 'Email Verified Successfully!';
      case 'error':
        return 'Verification Failed';
      case 'invalid':
        return 'Invalid Verification Link';
      default:
        return 'Email Verification';
    }
  };

  const getDescription = () => {
    switch (state) {
      case 'loading':
        return 'Please wait while we verify your email address.';
      case 'success':
        return 'Your email has been verified. You will be redirected to the login page shortly.';
      case 'error':
        return 'There was an error verifying your email. The token may be expired or invalid.';
      case 'invalid':
        return 'The verification link is missing or invalid. Please check your email for the correct link.';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-slate-900 flex items-center justify-center px-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">{getIcon()}</span>
            </div>
            <h1 className="text-2xl font-bold text-text-main dark:text-slate-100 mb-2">{getTitle()}</h1>
            <p className="text-text-body dark:text-slate-300">{getDescription()}</p>
          </div>
        </CardHeader>
        <CardBody>
          {state === 'loading' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4" />
              <p className="text-sm text-text-muted dark:text-slate-400">Verifying...</p>
            </div>
          )}

          {state === 'success' && (
            <div className="text-center space-y-4">
              <p className="text-sm text-accent font-medium">{message}</p>
              <p className="text-xs text-text-muted dark:text-slate-400">Redirecting to login page in 3 seconds...</p>
              <Button onClick={() => router.push('/auth')} className="w-full">
                Go to Login
              </Button>
            </div>
          )}

          {(state === 'error' || state === 'invalid') && (
            <div className="text-center space-y-4">
              <p className="text-sm text-danger">{message}</p>
              <div className="space-y-2">
                <Button onClick={() => router.push('/auth')} className="w-full">
                  Go to Login
                </Button>
                <Button variant="secondary" onClick={() => router.push('/auth/verify-prompt')} className="w-full">
                  Resend Verification Email
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

// Main page component with Suspense boundary
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerificationLoading />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
