'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useTheme } from '@/lib/theme';
import { useAuth } from '@/contexts/AuthContext';

// Lazy load components for better performance
const Button = dynamic(() => import('@/components/ui').then(mod => ({ default: mod.Button })), { ssr: true });

const ThemeToggle = dynamic(() => import('@/components/ui').then(mod => ({ default: mod.ThemeToggle })), { ssr: true });

export function Header() {
  const { theme, mounted } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="bg-surface dark:bg-slate-800 border-b border-border dark:border-slate-600 px-4 lg:px-8">
      <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-3">
            <div className="hidden sm:block">
              <Image
                src={
                  mounted && theme === 'dark'
                    ? '/brand/qeem-logo-horizontal-dark.svg'
                    : '/brand/qeem-logo-horizontal-light.svg'
                }
                alt="Qeem Logo"
                width={168}
                height={29}
                priority
                className="h-8 w-auto"
              />
            </div>
            <div className="block sm:hidden">
              <Image
                src={mounted && theme === 'dark' ? '/brand/qeem-mark.svg' : '/brand/qeem-mark-light.svg'}
                alt="Qeem"
                width={32}
                height={32}
                priority
                className="h-8 w-8"
              />
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-text-main dark:text-slate-100 hidden sm:block">
                {user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link href="/auth">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
