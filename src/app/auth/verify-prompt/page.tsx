'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ResendVerification } from '@/components/auth/ResendVerification';
import { Button } from '@/components/ui';

// Dynamic imports for better performance
const Card = dynamic(() => import('@/components/ui').then(mod => ({ default: mod.Card })), { ssr: true });
const CardHeader = dynamic(() => import('@/components/ui').then(mod => ({ default: mod.CardHeader })), { ssr: true });
const CardBody = dynamic(() => import('@/components/ui').then(mod => ({ default: mod.CardBody })), { ssr: true });

export default function VerifyPromptPage() {
  return (
    <div className="min-h-screen bg-bg dark:bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📧</span>
          </div>
          <h1 className="text-2xl font-bold text-text-main dark:text-slate-100 mb-2">Check Your Email</h1>
          <p className="text-text-body dark:text-slate-300">
            We&apos;ve sent a verification link to your email address. Please check your inbox and click the link to
            verify your account.
          </p>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-main dark:text-slate-100 mb-2">What to do next:</h2>
          </CardHeader>
          <CardBody>
            <ol className="space-y-3 text-sm text-text-body dark:text-slate-300">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center text-xs font-medium text-accent mr-3 mt-0.5">
                  1
                </span>
                Check your email inbox (and spam folder)
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center text-xs font-medium text-accent mr-3 mt-0.5">
                  2
                </span>
                Click the verification link in the email
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center text-xs font-medium text-accent mr-3 mt-0.5">
                  3
                </span>
                Return here to sign in to your account
              </li>
            </ol>
          </CardBody>
        </Card>

        {/* Resend Verification */}
        <ResendVerification />

        {/* Actions */}
        <div className="text-center space-y-3">
          <p className="text-sm text-text-muted dark:text-slate-400">Already verified your email?</p>
          <Link href="/auth">
            <Button className="w-full">Sign In to Your Account</Button>
          </Link>
        </div>

        {/* Help */}
        <div className="text-center">
          <p className="text-xs text-text-muted dark:text-slate-400">
            Having trouble? Check your spam folder or contact support if you don&apos;t receive the email within 5
            minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
