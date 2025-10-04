import '../globals.css';
import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports for better code splitting
const Header = dynamic(
  () => import('@/components/layouts').then(mod => ({ default: mod.Header })),
  {
    ssr: true,
    loading: () => <div className='h-16 bg-surface animate-pulse' />,
  }
);

const Sidebar = dynamic(
  () => import('@/components/layouts').then(mod => ({ default: mod.Sidebar })),
  {
    ssr: true,
    loading: () => <div className='w-64 bg-surface animate-pulse' />,
  }
);

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className='app-layout'>
      <Header />
      <Sidebar />
      <main className='main-content'>{children}</main>
    </div>
  );
}
