# 🎨 Qeem Frontend

> **Beautiful, Modern UI for Egypt's AI-Powered Freelance Rate Calculator**

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)

## 🌟 Overview

Qeem Frontend is the stunning user interface that brings Egypt's first AI-powered freelance rate calculator to life. Built with **Next.js 15**, **TypeScript**, and a custom design system, it provides an intuitive and beautiful experience for freelancers to discover their true worth.

### 🎯 Key Features

- **🎨 Custom Design System** - Beautiful, consistent UI with CSS custom properties
- **🌙 Dark Mode Support** - Seamless theme switching with `[data-theme="dark"]`
- **📱 Responsive Design** - Perfect on desktop, tablet, and mobile
- **⚡ Lightning Fast** - Next.js App Router with optimized performance
- **🔐 Secure Authentication** - JWT-based auth with OAuth integration
- **📊 Interactive Dashboard** - Real-time rate calculations and market insights
- **💬 AI Negotiation Assistant** - GPT-powered client negotiation strategies
- **📄 Invoice & Contract Management** - Complete freelancer business toolkit

## 🎨 Design System

Our custom design system ensures consistency and beauty across the entire application:

### 🎨 Brand Colors

```css
--q-primary: #1A2B48    /* Deep blue - trust and professionalism */
--q-accent: #22C55E     /* Green - growth and success */
--q-text-main: #1A2B48  /* Primary text color */
--q-surface: #FFFFFF    /* Card and surface backgrounds */
```

### 📏 Spacing Scale

```css
--space-xs: 0.25rem     /* 4px */
--space-sm: 0.5rem      /* 8px */
--space-md: 1rem        /* 16px */
--space-lg: 1.5rem       /* 24px */
--space-xl: 2rem         /* 32px */
```

### 🌙 Dark Mode

Automatic dark mode support with semantic color tokens that adapt to the theme.

## 🚀 Quick Start

### Prerequisites

- **Node.js 20+**
- **npm** or **yarn**
- **Docker** (optional)

### Installation

1. **Clone and Setup**

   ```bash
   git clone https://github.com/your-org/qeem-frontend.git
   cd qeem-frontend

   # Install dependencies
   npm install
   # or
   yarn install
   ```

2. **Environment Configuration**

   ```bash
   # Create .env.local
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
   ```

3. **Run Development Server**

   ```bash
   # Development
   npm run dev
   # or
   yarn dev

   # Open http://localhost:3000
   ```

### 🐳 Docker Setup

```bash
# Build and run with Docker
docker build -t qeem-frontend .
docker run -p 3000:3000 qeem-frontend

# Or use Docker Compose
docker-compose up frontend
```

## 🏗️ Project Structure

```
qeem-frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (app)/             # Authenticated app routes
│   │   │   ├── calculator/     # Rate calculator page
│   │   │   ├── market/         # Market insights dashboard
│   │   │   ├── invoices/       # Invoice management
│   │   │   ├── contracts/      # Contract management
│   │   │   └── profile/        # User profile settings
│   │   ├── globals.css        # Global styles and design tokens
│   │   ├── layout.tsx         # Root layout component
│   │   └── page.tsx           # Landing page
│   ├── styles/
│   │   └── tokens.css         # Design system tokens
│   └── components/            # Reusable UI components
├── public/
│   └── brand/                 # Brand assets and logos
├── package.json
└── next.config.js
```

## 🎨 Design System Usage

### Using Design Tokens

```tsx
// ✅ Correct - Use design tokens
<div style={{
  backgroundColor: 'var(--q-surface)',
  padding: 'var(--space-md)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-md)'
}}>
  Content
</div>

// ❌ Incorrect - Hard-coded values
<div style={{
  backgroundColor: '#FFFFFF',
  padding: '16px',
  borderRadius: '8px'
}}>
  Content
</div>
```

### Component Classes

```tsx
// Pre-defined component classes
<button className="btn btn-primary">Calculate Rate</button>
<div className="card">Rate calculation results</div>
<input className="input-field" placeholder="Enter your skills" />
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Type checking
npm run type-check   # Run TypeScript compiler
```

### Code Quality

```bash
# Format code
npm run format

# Lint code
npm run lint

# Type check
npm run type-check
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📱 Features

### 🧮 Rate Calculator

- **Smart Form** - React Hook Form with Zod validation
- **Real-time Calculation** - Instant rate updates as you type
- **Multi-currency Support** - EGP, USD, EUR with live conversion
- **Detailed Breakdown** - See how your rate is calculated
- **Save & Export** - Save calculations and export as PDF

### 📊 Market Dashboard

- **Live Market Data** - Real-time freelance market insights
- **Trend Analysis** - See how rates change over time
- **Skill Demand** - Discover which skills are in high demand
- **Location Insights** - Compare rates across different Egyptian cities

### 💬 AI Negotiation Assistant

- **Smart Suggestions** - AI-powered negotiation strategies
- **Client Analysis** - Understand your client's perspective
- **Email Templates** - Professional email templates for negotiations
- **Success Tracking** - Track your negotiation success rate

### 📄 Business Tools

- **Invoice Generator** - Create professional invoices
- **Contract Templates** - Legal contract templates
- **Payment Tracking** - Track payments and overdue invoices
- **Tax Calculator** - Calculate taxes for Egyptian freelancers

## 🚀 Performance

- **Lighthouse Score**: 95+ across all metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3s

### Optimization Features

- **Image Optimization** - Next.js automatic image optimization
- **Code Splitting** - Automatic code splitting for optimal loading
- **Static Generation** - Pre-rendered pages for maximum performance
- **Edge Caching** - CDN-ready with edge caching support

## 🌐 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 🔧 Configuration

### Environment Variables

```bash
# Required
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://...
NEXT_PUBLIC_POSTHOG_KEY=phc_...
```

### Next.js Configuration

```javascript
// next.config.js
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "api.qeem.com"],
  },
  experimental: {
    // Enable experimental features
  },
};
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
npm install -g vercel
vercel

# Or connect GitHub repository
# Vercel will auto-deploy on push to main
```

### Docker Production

```bash
# Build production image
docker build -t qeem-frontend:latest .

# Run production container
docker run -p 3000:3000 qeem-frontend:latest
```

### Other Platforms

- **Netlify** - Static site hosting
- **AWS Amplify** - Full-stack deployment
- **Railway** - Simple deployment platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the design system strictly
- Use TypeScript for all new code
- Write tests for new components
- Ensure accessibility compliance
- Use semantic HTML elements

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Design System**: [UI/UX Design System Guide](../qeem-meta/docs/)
- **Issues**: [GitHub Issues](https://github.com/your-org/qeem-frontend/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/qeem-frontend/discussions)

## 🙏 Acknowledgments

- **Next.js** - React framework for production
- **TypeScript** - Typed JavaScript at scale
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Performant forms with easy validation

---

<div align="center">
  <strong>Built with ❤️ for Egyptian Freelancers</strong>
  <br>
  <em>Beautiful UI. Powerful Features. Your Success.</em>
</div>
