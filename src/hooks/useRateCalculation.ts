import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiClient, handleApiError } from '@/lib/api';
import { RateRequest, RateResponse } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';

export function useRateCalculation() {
  const [results, setResults] = useState<RateResponse | null>(null);
  const { isAuthenticated } = useAuth();

  const mutation = useMutation({
    mutationFn: (data: RateRequest) => {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to calculate rates');
      }
      return apiClient.calculateRate(data);
    },
    onSuccess: data => {
      setResults(data);
    },
    onError: error => {
      console.error('Rate calculation failed:', handleApiError(error));
    },
  });

  const calculateRate = (data: RateRequest) => {
    if (!isAuthenticated) {
      mutation.mutate(data); // This will trigger the error
      return;
    }
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
    isAuthenticated,
  };
}
