# Qeem Frontend

Egypt's first AI-powered freelance rate calculator frontend built with Next.js 15, TypeScript, and a custom design system.

## 🚀 Features

- **Modern Stack**: Next.js 15 with App Router, TypeScript, and React 18
- **Custom Design System**: CSS custom properties with dark mode support
- **Performance Optimized**: Core Web Vitals monitoring and optimization
- **Accessibility First**: WCAG 2.1 AA compliant components
- **Testing Ready**: Jest and React Testing Library configured
- **Developer Experience**: ESLint, Prettier, and TypeScript strict mode
- **Responsive Design**: Mobile-first approach with utility classes

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Custom CSS with design tokens
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
├── styles/              # CSS files
│   ├── tokens.css       # Design tokens
│   ├── base.css         # Base styles
│   └── components.css   # Component styles
└── types/               # TypeScript type definitions
```

## 🎨 Design System

### Design Tokens

The design system uses CSS custom properties for consistent theming:

```css
/* Colors */
--q-primary: #22c55e;
--q-accent: #3b82f6;
--q-success: #10b981;
--q-warning: #f59e0b;
--q-danger: #ef4444;

/* Spacing */
--space-xs: 0.25rem;
--space-sm: 0.5rem;
--space-md: 1rem;
--space-lg: 1.5rem;
--space-xl: 2rem;
--space-2xl: 3rem;

/* Typography */
--font-size-xs: 0.75rem;
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
--font-size-lg: 1.125rem;
--font-size-xl: 1.25rem;
```

### Dark Mode

Dark mode is supported through the `data-theme` attribute:

```tsx
// Light mode (default)
<html data-theme="light">

// Dark mode
<html data-theme="dark">
```

### Utility Classes

The design system includes utility classes for common patterns:

```css
/* Layout */
.flex, .grid, .block, .hidden
.items-center, .justify-between
.p-4, .m-2, .gap-3

/* Typography */
.text-lg, .font-bold, .text-center
.text-primary, .text-muted

/* Spacing */
.p-0, .p-1, .p-2, .p-3, .p-4, .p-6, .p-8
.m-0, .m-1, .m-2, .m-3, .m-4, .m-6, .m-8

/* Responsive */
.sm:hidden, .md:block, .lg:flex
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

## 🌙 Theme Management

The application supports light/dark mode with system preference detection:

```tsx
import { useTheme } from '@/lib/theme';

function ThemeToggle() {
  const { theme, toggleTheme, effectiveTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
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
