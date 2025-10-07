import dynamic from 'next/dynamic';
import { AuthGuard } from '@/components/auth/AuthGuard';

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
  return (
    <AuthGuard>
      <RateCalculatorForm />
    </AuthGuard>
  );
}
