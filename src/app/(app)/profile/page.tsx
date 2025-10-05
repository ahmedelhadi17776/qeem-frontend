import dynamic from 'next/dynamic';

const Card = dynamic(
  () => import('@/components/ui').then(mod => ({ default: mod.Card })),
  { ssr: true }
);

const CardBody = dynamic(
  () => import('@/components/ui').then(mod => ({ default: mod.CardBody })),
  { ssr: true }
);

export default function ProfilePage() {
  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-3xl font-bold text-text-main dark:text-slate-100 mb-2'>
          Profile Settings
        </h1>
        <p className='text-text-body dark:text-slate-300'>
          Manage your account and preferences
        </p>
      </div>

      <Card>
        <CardBody>
          <div className='text-center py-12'>
            <div className='w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4'>
              <span className='text-2xl'>👤</span>
            </div>
            <h2 className='text-xl font-semibold text-text-main dark:text-slate-100 mb-2'>
              Profile Management Coming Soon
            </h2>
            <p className='text-text-body dark:text-slate-300 max-w-md mx-auto'>
              We're building a comprehensive profile management system where you
              can update your skills, experience, portfolio, and account
              preferences.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
