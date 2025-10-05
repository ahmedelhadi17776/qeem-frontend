'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Lazy load UI components for better performance
const Button = dynamic(
  () => import('@/components/ui').then(mod => ({ default: mod.Button })),
  { ssr: true }
);

const Card = dynamic(
  () => import('@/components/ui').then(mod => ({ default: mod.Card })),
  { ssr: true }
);

const CardBody = dynamic(
  () => import('@/components/ui').then(mod => ({ default: mod.CardBody })),
  { ssr: true }
);

const ThemeToggle = dynamic(
  () => import('@/components/ui').then(mod => ({ default: mod.ThemeToggle })),
  { ssr: true }
);

// Import useTheme hook
import { useTheme } from '@/lib/theme';

// Client component for interactive landing page
function LandingPageContent() {
  const { theme, mounted } = useTheme();

  return (
    <>
      {/* Header */}
      <header className='absolute top-0 left-0 right-0 z-10 bg-surface/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-border/50 dark:border-slate-600/50'>
        <div className='flex items-center justify-between h-16 px-4 lg:px-8 max-w-7xl mx-auto'>
          <Link href='/' className='flex items-center space-x-3'>
            <Image
              src={
                mounted && theme === 'dark'
                  ? '/brand/qeem-mark.svg'
                  : '/brand/qeem-mark-light.svg'
              }
              alt='Qeem'
              width={32}
              height={32}
              priority
              className='h-8 w-8'
            />
            <span className='text-lg sm:text-xl font-bold text-text-main dark:text-slate-100'>
              Qeem
            </span>
          </Link>

          <div className='flex items-center space-x-2 sm:space-x-4'>
            <ThemeToggle />
            <Link href='/calculator'>
              <Button size='sm'>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className='min-h-screen bg-bg dark:bg-slate-900 flex items-center pt-16'>
        <div className='grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center min-h-[calc(100vh-4rem)] px-4 lg:px-8 py-12 lg:py-20 max-w-7xl mx-auto w-full'>
          <div className='max-w-2xl'>
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6'>
              <span className='w-2 h-2 bg-accent rounded-full animate-pulse'></span>
              Egypt's First AI-Powered Rate Calculator
            </div>

            <h1 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-text-main dark:text-slate-100 leading-tight mb-6'>
              Qeem —{' '}
              <span className='bg-gradient-to-r from-accent to-accent-dark bg-clip-text text-transparent'>
                Know your value.
              </span>
            </h1>

            <p className='text-lg sm:text-xl text-text-body dark:text-slate-300 mb-8 leading-relaxed max-w-xl'>
              Discover your true worth and negotiate with confidence using
              data-driven insights. Get personalized rate recommendations based
              on your skills, experience, and market conditions.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 mb-8'>
              <Link href='/calculator'>
                <Button size='lg' className='group'>
                  <span>Calculate My Rate</span>
                  <svg
                    className='w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 7l5 5m0 0l-5 5m5-5H6'
                    />
                  </svg>
                </Button>
              </Link>
              <Link href='/market'>
                <Button variant='secondary' size='lg'>
                  View Market Data
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-border dark:border-slate-600'>
              <div>
                <div className='text-xl sm:text-2xl font-bold text-accent'>
                  10K+
                </div>
                <div className='text-xs sm:text-sm text-text-muted dark:text-slate-400'>
                  Freelancers
                </div>
              </div>
              <div>
                <div className='text-xl sm:text-2xl font-bold text-accent'>
                  95%
                </div>
                <div className='text-xs sm:text-sm text-text-muted dark:text-slate-400'>
                  Accuracy
                </div>
              </div>
              <div>
                <div className='text-xl sm:text-2xl font-bold text-accent'>
                  ₦50M+
                </div>
                <div className='text-xs sm:text-sm text-text-muted dark:text-slate-400'>
                  Saved
                </div>
              </div>
            </div>
          </div>

          <div className='lg:order-first'>
            <div className='relative'>
              {/* Floating Cards */}
              <Card className='bg-surface dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2'>
                <CardBody>
                  <h2 className='text-2xl font-bold text-text-main dark:text-slate-100 mb-6'>
                    Why Choose Qeem?
                  </h2>
                  <ul className='space-y-4'>
                    <li className='flex items-center gap-3 text-text-body dark:text-slate-300 group'>
                      <div className='w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors'>
                        <span className='text-lg'>🎯</span>
                      </div>
                      <div>
                        <div className='font-semibold'>
                          AI-Powered Calculations
                        </div>
                        <div className='text-sm text-text-muted dark:text-slate-400'>
                          Advanced algorithms for accurate rates
                        </div>
                      </div>
                    </li>
                    <li className='flex items-center gap-3 text-text-body dark:text-slate-300 group'>
                      <div className='w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors'>
                        <span className='text-lg'>📊</span>
                      </div>
                      <div>
                        <div className='font-semibold'>
                          Real-time Market Data
                        </div>
                        <div className='text-sm text-text-muted dark:text-slate-400'>
                          Live insights from the Egyptian market
                        </div>
                      </div>
                    </li>
                    <li className='flex items-center gap-3 text-text-body dark:text-slate-300 group'>
                      <div className='w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors'>
                        <span className='text-lg'>💬</span>
                      </div>
                      <div>
                        <div className='font-semibold'>
                          Negotiation Strategies
                        </div>
                        <div className='text-sm text-text-muted dark:text-slate-400'>
                          Expert tips to maximize your earnings
                        </div>
                      </div>
                    </li>
                    <li className='flex items-center gap-3 text-text-body dark:text-slate-300 group'>
                      <div className='w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors'>
                        <span className='text-lg'>📄</span>
                      </div>
                      <div>
                        <div className='font-semibold'>Complete Toolkit</div>
                        <div className='text-sm text-text-muted dark:text-slate-400'>
                          Invoices, contracts, and more
                        </div>
                      </div>
                    </li>
                  </ul>
                </CardBody>
              </Card>

              {/* Floating elements for visual interest */}
              <div className='absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-16 h-16 sm:w-20 sm:h-20 bg-accent/10 rounded-full animate-pulse'></div>
              <div className='absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-12 h-12 sm:w-16 sm:h-16 bg-accent/5 rounded-full animate-pulse delay-1000'></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 bg-surface/30 dark:bg-slate-800/30'>
        <div className='max-w-7xl mx-auto px-4 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-text-main dark:text-slate-100 mb-4'>
              Everything you need to succeed
            </h2>
            <p className='text-lg sm:text-xl text-text-body dark:text-slate-300 max-w-2xl mx-auto'>
              From rate calculation to contract management, we've got you
              covered.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <Card className='text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1'>
              <CardBody>
                <div className='w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <span className='text-2xl'>🧮</span>
                </div>
                <h3 className='text-xl font-bold text-text-main dark:text-slate-100 mb-2'>
                  Smart Calculator
                </h3>
                <p className='text-text-body dark:text-slate-300'>
                  Get personalized rate recommendations based on your skills and
                  market conditions.
                </p>
              </CardBody>
            </Card>

            <Card className='text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1'>
              <CardBody>
                <div className='w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <span className='text-2xl'>📈</span>
                </div>
                <h3 className='text-xl font-bold text-text-main dark:text-slate-100 mb-2'>
                  Market Insights
                </h3>
                <p className='text-text-body dark:text-slate-300'>
                  Access real-time data on freelance rates across different
                  industries in Egypt.
                </p>
              </CardBody>
            </Card>

            <Card className='text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1'>
              <CardBody>
                <div className='w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <span className='text-2xl'>⚡</span>
                </div>
                <h3 className='text-xl font-bold text-text-main dark:text-slate-100 mb-2'>
                  Quick Start
                </h3>
                <p className='text-text-body dark:text-slate-300'>
                  Get your rates in seconds. No complex setup, just accurate
                  results.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-gradient-to-r from-accent/5 to-accent-dark/5 dark:from-accent/10 dark:to-accent-dark/10'>
        <div className='max-w-4xl mx-auto text-center px-4 lg:px-8'>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-text-main dark:text-slate-100 mb-4'>
            Ready to discover your true value?
          </h2>
          <p className='text-lg sm:text-xl text-text-body dark:text-slate-300 mb-8 max-w-2xl mx-auto'>
            Join thousands of freelancers who are already earning what they
            deserve.
          </p>
          <Link href='/calculator'>
            <Button size='lg' className='group'>
              <span>Start Calculating Now</span>
              <svg
                className='w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 7l5 5m0 0l-5 5m5-5H6'
                />
              </svg>
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}

export default function Home() {
  return <LandingPageContent />;
}
