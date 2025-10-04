import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiClient, handleApiError } from '@/lib/api';
import { RateRequest, RateResponse } from '@/types/api';

export function useRateCalculation() {
  const [results, setResults] = useState<RateResponse | null>(null);

  const mutation = useMutation({
    mutationFn: (data: RateRequest) => apiClient.calculateRate(data),
    onSuccess: data => {
      setResults(data);
    },
    onError: error => {
      console.error('Rate calculation failed:', handleApiError(error));
    },
  });

  const calculateRate = (data: RateRequest) => {
    mutation.mutate(data);
  };

  const reset = () => {
    setResults(null);
    mutation.reset();
  };

  return {
    calculateRate,
    results,
    loading: mutation.isPending,
    error: mutation.error ? handleApiError(mutation.error) : null,
    reset,
  };
}
