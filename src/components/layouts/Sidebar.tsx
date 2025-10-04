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
    <aside className={clsx('sidebar', className)}>
      <nav className='sidebar-nav'>
        <div className='sidebar-header'>
          <h2 className='sidebar-title'>Navigation</h2>
        </div>

        <ul className='sidebar-menu'>
          {navigationItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href} className='sidebar-item'>
                <Link
                  href={item.href}
                  className={clsx(
                    'sidebar-link',
                    isActive && 'sidebar-link-active'
                  )}
                >
                  <span className='sidebar-icon'>{item.icon}</span>
                  <span className='sidebar-text'>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
