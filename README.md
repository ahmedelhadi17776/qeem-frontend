# Qeem Frontend

Egypt's first AI-powered freelance rate calculator frontend built with Next.js 15, TypeScript, and a custom design system.

## 🚀 Features

- **Modern Stack**: Next.js 15 with App Router, TypeScript, and React 18
- **Tailwind CSS**: Complete migration to Tailwind CSS v3.4.0 with custom brand configuration
- **Design System**: Utility-first approach with Qeem brand colors and typography
- **Dark Mode**: Seamless theme switching with `[data-theme="dark"]` attribute
- **Performance Optimized**: Core Web Vitals monitoring and optimization
- **Accessibility First**: WCAG 2.1 AA compliant components
- **Testing Ready**: Jest and React Testing Library configured
- **Developer Experience**: ESLint, Prettier, and TypeScript strict mode
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v3.4.0 with custom brand configuration
- **State Management**: React Query + Zustand
- **Forms**: React Hook Form + Zod validation
- **Testing**: Jest + React Testing Library
- **Code Quality**: ESLint + Prettier
- **Performance**: Custom performance monitoring

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (app)/             # Authenticated app routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # Reusable components
│   ├── ui/               # UI components (Button, Input, Card)
│   ├── layouts/          # Layout components (Header, Sidebar)
│   └── shared/           # Shared components
├── features/             # Feature-specific components
│   └── calculator/       # Rate calculator feature
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── api.ts           # API client
│   ├── utils.ts         # Utility functions
│   ├── theme.ts         # Theme management
│   └── performance.ts   # Performance monitoring
├── styles/              # Tailwind CSS files
│   └── globals.css      # Global styles with Tailwind directives
└── types/               # TypeScript type definitions
```

## 🎨 Design System

### Tailwind CSS Configuration

The design system uses Tailwind CSS v3.4.0 with custom brand configuration:

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: '#1A2B48', // Qeem navy
        accent: {
          DEFAULT: '#22C55E', // Qeem green
          dark: '#16A34A', // Qeem green dark
        },
        danger: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
        success: '#22C55E',
        // ... more brand colors
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        arabic: ['IBM Plex Sans Arabic', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
```

### Brand Colors

```css
/* Primary Colors */
primary: #1A2B48          /* Qeem navy */
accent: #22C55E           /* Qeem green */
accent-dark: #16A34A      /* Qeem green dark */

/* Semantic Colors */
danger: #EF4444           /* Red */
warning: #F59E0B          /* Orange */
info: #3B82F6            /* Blue */
success: #22C55E         /* Green */

/* Neutral Colors */
text-main: #1A2B48       /* Dark text */
text-body: #334155       /* Body text */
text-muted: #64748B      /* Muted text */
bg: #F1F5F9             /* Background */
surface: #FFFFFF        /* Surface */
border: #E2E8F0         /* Border */
```

### Dark Mode

Dark mode is supported through Tailwind's dark mode with `[data-theme="dark"]` attribute:

```tsx
// Light mode (default)
<html data-theme="light">

// Dark mode
<html data-theme="dark">
```

### Tailwind Utility Classes

The design system uses Tailwind's utility-first approach:

```css
/* Layout */
flex, grid, block, hidden
items-center, justify-between
p-4, m-2, gap-3

/* Typography */
text-lg, font-bold, text-center
text-primary, text-muted

/* Brand Colors */
text-primary, text-accent, text-main, text-body
bg-primary, bg-accent, bg-surface

/* Spacing */
p-0, p-1, p-2, p-3, p-4, p-6, p-8
m-0, m-1, m-2, m-3, m-4, m-6, m-8

/* Dark Mode */
dark:text-white, dark:bg-slate-900
dark:border-gray-700

/* Responsive */
sm:hidden, md:block, lg:flex
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd qeem-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run test:ci` - Run tests for CI
- `npm run quality` - Run all quality checks

## 🧪 Testing

The project uses Jest and React Testing Library for testing:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

## 🎯 Performance

The application includes performance monitoring for Core Web Vitals:

- **LCP** (Largest Contentful Paint)
- **FID** (First Input Delay)
- **CLS** (Cumulative Layout Shift)

### Performance Utilities

```tsx
import { usePerformanceMonitor } from '@/lib/performance';

function MyComponent() {
  const { startTiming, endTiming } = usePerformanceMonitor();

  const handleClick = () => {
    startTiming('button-click');
    // ... do something
    endTiming('button-click');
  };
}
```

### Development Performance Optimization

The project is optimized for fast development experience:

#### Environment Variables for Development

Create `.env.development` for optimized development:

```bash
# Development Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:8000

# Development Tools (disabled for performance)
NEXT_PUBLIC_ENABLE_DEVTOOLS=false
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=false

# Next.js Optimizations
NEXT_TELEMETRY_DISABLED=1
```

#### Enabling Development Tools

When you need debugging tools, temporarily enable them:

```bash
# Enable React Query DevTools
NEXT_PUBLIC_ENABLE_DEVTOOLS=true

# Enable Performance Monitoring
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
```

#### Expected Performance

With optimizations enabled:

- **Initial startup**: 5-7s (vs 10s+ without optimizations)
- **Hot reload**: 0.5-1s (vs 3s+ without optimizations)
- **Memory usage**: Reduced by ~30%
- **CPU usage**: Reduced by ~40% during idle

#### Troubleshooting Slow Development

If development is still slow:

1. **Check Turbopack**: Ensure you're using `npm run dev` (includes `--turbo`)
2. **Clear cache**: `rm -rf .next && npm run dev`
3. **Disable tools**: Set environment variables to `false`
4. **Check TypeScript**: Run `npm run type-check` to identify slow type checking

## 🌙 Theme Management

The application supports light/dark mode with Tailwind CSS:

```tsx
import { useTheme } from '@/lib/theme';

function ThemeToggle() {
  const { effectiveTheme, toggleTheme, mounted } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-text-body hover:bg-primary/6 dark:text-text-main dark:hover:bg-text-main/6"
    >
      {effectiveTheme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
}
```

## 🔧 Configuration

### Environment Variables

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your-ga-id
NEXT_PUBLIC_HOTJAR_ID=your-hotjar-id
```

### TypeScript Configuration

The project uses strict TypeScript configuration:

```json
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

## 📦 Deployment

### Docker

```bash
# Build Docker image
docker build -t qeem-frontend .

# Run container
docker run -p 3000:3000 qeem-frontend
```

### Vercel

The application is optimized for Vercel deployment:

```bash
# Deploy to Vercel
vercel --prod
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Quality

Before submitting a PR, ensure:

- [ ] All tests pass: `npm run test`
- [ ] Code is formatted: `npm run format`
- [ ] No linting errors: `npm run lint`
- [ ] TypeScript compiles: `npm run type-check`
- [ ] All quality checks pass: `npm run quality`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@qeem.com or join our Discord community.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- React team for the excellent library
- TypeScript team for the type system
- All contributors who help make this project better
