import './globals.css';
import type { ReactNode } from 'react';
import { Providers } from './providers';
import Script from 'next/script';

export const metadata = {
  title: 'Qeem - Know Your Value',
  description:
    "Egypt's AI-powered freelance rate calculator. Discover your true worth and negotiate with confidence.",
  keywords: ['freelance', 'rates', 'calculator', 'Egypt', 'AI', 'negotiation'],
  authors: [{ name: 'Qeem Team' }],
  icons: {
    icon: [
      { url: '/brand/qeem-mark.svg', sizes: 'any' },
      { url: '/brand/qeem-mark.svg', sizes: '16x16', type: 'image/svg+xml' },
      { url: '/brand/qeem-mark.svg', sizes: '32x32', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/brand/qeem-mark.svg', sizes: '180x180' }],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' data-theme='light'>
      <head>
        <Script id='theme-init' strategy='beforeInteractive'>
          {`
            (function() {
              const theme = localStorage.getItem('theme') || 'light';
              document.documentElement.setAttribute('data-theme', theme);
            })();
          `}
        </Script>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
