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
    <div className='app-layout'>
      <Header />
      <Sidebar />
      <main className='main-content'>{children}</main>
    </div>
  );
}
