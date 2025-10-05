'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

interface SidebarProps {
  className?: string;
}

const navigationItems = [
  {
    name: 'Calculator',
    href: '/calculator',
    icon: '🧮',
  },
  {
    name: 'Market',
    href: '/market',
    icon: '📊',
  },
  {
    name: 'Invoices',
    href: '/invoices',
    icon: '📄',
  },
  {
    name: 'Contracts',
    href: '/contracts',
    icon: '📋',
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: '👤',
  },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={clsx(
          'hidden lg:block bg-surface border-r border-border p-6 overflow-y-auto',
          'lg:fixed lg:left-0 lg:top-16 lg:bottom-0 lg:w-70',
          className
        )}
      >
        <nav className='h-full'>
          <div className='mb-6'>
            <h2 className='text-lg font-bold text-text-main'>Navigation</h2>
          </div>

          <ul className='space-y-1'>
            {navigationItems.map(item => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      'flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-fast',
                      'hover:bg-accent/10 hover:text-accent',
                      isActive
                        ? 'bg-accent/10 text-accent'
                        : 'text-text-body hover:text-text-main'
                    )}
                  >
                    <span className='text-lg'>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className='lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-sticky'>
        <div className='grid grid-cols-5 h-18 px-2 py-2'>
          {navigationItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-md transition-all duration-fast',
                  'hover:bg-accent/10',
                  isActive
                    ? 'text-accent'
                    : 'text-text-body hover:text-text-main'
                )}
              >
                <span className='text-xl'>{item.icon}</span>
                <span className='text-xs font-medium'>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
