/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Performance optimizations (Turbopack compatible)
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['clsx', '@tanstack/react-query'],
  },
  
  images: {
    domains: ['localhost', 'api.qeem.com'],
  },
  async headers() {
    // Simplified headers for better dev performance
    const isDev = process.env.NODE_ENV === 'development';
    
    if (!isDev) {
      // Only add CSP in production to reduce dev overhead
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
              value: prodCsp,
            },
          ],
        },
      ];
    }
    
    return [];
  },
};

module.exports = nextConfig;
