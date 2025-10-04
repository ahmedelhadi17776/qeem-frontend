/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'api.qeem.com'],
  },
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    
    // More permissive CSP for development to allow HMR and Next.js features
    const devCsp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob:",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "connect-src 'self' ws: wss:",
      "worker-src 'self' blob:",
      "font-src 'self' data:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');

    // Stricter CSP for production
    const prodCsp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: isDev ? devCsp : prodCsp,
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
