import Link from 'next/link';
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

export default function Home() {
  return (
    <main className='min-h-screen bg-bg'>
      <div className='grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center min-h-screen px-4 lg:px-8 py-12 lg:py-20 max-w-7xl mx-auto'>
        <div className='max-w-2xl'>
          <h1 className='text-4xl lg:text-5xl xl:text-6xl font-extrabold text-text-main leading-tight mb-6'>
            Qeem —{' '}
            <span className='bg-gradient-to-r from-accent to-accent-dark bg-clip-text text-transparent'>
              Know your value.
            </span>
          </h1>
          <p className='text-xl text-text-body mb-8 leading-relaxed max-w-xl'>
            Egypt&apos;s first AI-powered freelance rate calculator. Discover
            your true worth and negotiate with confidence using data-driven
            insights.
          </p>
          <div className='flex flex-col sm:flex-row gap-4'>
            <Link href='/calculator'>
              <Button size='lg'>Calculate My Rate</Button>
            </Link>
            <Link href='/market'>
              <Button variant='secondary' size='lg'>
                View Market Data
              </Button>
            </Link>
          </div>
        </div>

        <div className='lg:order-first'>
          <Card className='bg-surface shadow-lg'>
            <CardBody>
              <h2 className='text-2xl font-bold text-text-main mb-6'>
                Why Qeem?
              </h2>
              <ul className='space-y-4'>
                <li className='flex items-center gap-3 text-text-body'>
                  <span className='text-2xl'>🎯</span>
                  <span>AI-powered rate calculations</span>
                </li>
                <li className='flex items-center gap-3 text-text-body'>
                  <span className='text-2xl'>📊</span>
                  <span>Real-time market insights</span>
                </li>
                <li className='flex items-center gap-3 text-text-body'>
                  <span className='text-2xl'>💬</span>
                  <span>Negotiation strategies</span>
                </li>
                <li className='flex items-center gap-3 text-text-body'>
                  <span className='text-2xl'>📄</span>
                  <span>Invoice & contract tools</span>
                </li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </main>
  );
}
