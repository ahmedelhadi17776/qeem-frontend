import '../globals.css';
import type { ReactNode } from 'react';
import { Header, Sidebar } from '@/components/layouts';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className='app-layout'>
      <Header />
      <Sidebar />
      <main className='main-content'>{children}</main>
    </div>
  );
}
