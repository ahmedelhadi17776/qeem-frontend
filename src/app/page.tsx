import Link from 'next/link';
import { Button, Card, CardBody } from '@/components/ui';

export default function Home() {
  return (
    <main className='container'>
      <div className='hero'>
        <div className='hero-content'>
          <h1 className='hero-title'>
            Qeem — <span className='text-gradient'>Know your value.</span>
          </h1>
          <p className='hero-subtitle'>
            Egypt&apos;s first AI-powered freelance rate calculator. Discover
            your true worth and negotiate with confidence using data-driven
            insights.
          </p>
          <div className='hero-cta'>
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
        <div className='hero-visual'>
          <Card>
            <CardBody>
              <h2>Why Qeem?</h2>
              <ul>
                <li>🎯 AI-powered rate calculations</li>
                <li>📊 Real-time market insights</li>
                <li>💬 Negotiation strategies</li>
                <li>📄 Invoice & contract tools</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </main>
  );
}
