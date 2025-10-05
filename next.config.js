/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // For Docker optimization

  // Performance optimizations (Turbopack compatible)
  experimental: {
    optimizePackageImports: ['clsx', 'react-hook-form', 'zod'],
  },

  images: {
    domains: ['localhost', 'api.qeem.com'],
  },

  // Simplified headers for dev performance
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';

    if (!isDev) {
      const prodCsp = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data:",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
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

  // Webpack config for fallback (when not using Turbopack)
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Reduce file watching overhead
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.next/**',
          '**/coverage/**',
          '**/dist/**',
          '**/.vscode/**',
          '**/.idea/**',
        ],
      };
    }

    return config;
  },
};

module.exports = nextConfig;
