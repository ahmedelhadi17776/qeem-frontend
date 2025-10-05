import '../globals.css';
import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports for better code splitting
const Header = dynamic(
  () => import('@/components/layouts').then(mod => ({ default: mod.Header })),
  {
    loading: () => null, // Faster compilation in dev
  }
);

const Sidebar = dynamic(
  () => import('@/components/layouts').then(mod => ({ default: mod.Sidebar })),
  {
    loading: () => null, // Faster compilation in dev
  }
);

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-screen bg-bg'>
      <Header />
      <div className='lg:pl-70'>
        <Sidebar />
        <main className='px-4 lg:px-8 py-8 pb-20 lg:pb-8 max-w-7xl mx-auto'>
          {children}
        </main>
      </div>
    </div>
  );
}
