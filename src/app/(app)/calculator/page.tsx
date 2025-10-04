import dynamic from 'next/dynamic';

// Dynamic import for the calculator form to reduce initial bundle size
const RateCalculatorForm = dynamic(
  () =>
    import('@/features/calculator/RateCalculatorForm').then(mod => ({
      default: mod.RateCalculatorForm,
    })),
  {
    ssr: true,
    loading: () => (
      <div className='space-y-6 p-6'>
        <div className='h-8 bg-surface animate-pulse rounded' />
        <div className='space-y-4'>
          <div className='h-12 bg-surface animate-pulse rounded' />
          <div className='h-12 bg-surface animate-pulse rounded' />
          <div className='h-12 bg-surface animate-pulse rounded' />
        </div>
      </div>
    ),
  }
);

export default function CalculatorPage() {
  return <RateCalculatorForm />;
}
