import './globals.css';
import type { ReactNode } from 'react';
import { Providers } from './providers';

export const metadata = {
  title: 'Qeem - Know Your Value',
  description:
    "Egypt's AI-powered freelance rate calculator. Discover your true worth and negotiate with confidence.",
  keywords: ['freelance', 'rates', 'calculator', 'Egypt', 'AI', 'negotiation'],
  authors: [{ name: 'Qeem Team' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' data-theme='light'>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
