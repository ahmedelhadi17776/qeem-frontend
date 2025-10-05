import dynamic from 'next/dynamic';

// Dynamic import for the calculator form to reduce initial bundle size
const RateCalculatorForm = dynamic(
  () =>
    import('@/features/calculator/RateCalculatorForm').then(mod => ({
      default: mod.RateCalculatorForm,
    })),
  {
    loading: () => null, // Faster compilation in dev
  },
);

export default function CalculatorPage() {
  return <RateCalculatorForm />;
}
