import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiError } from '@/lib/api';
import { RateRequest, RateResponse } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';

export function useRateCalculation() {
  const [results, setResults] = useState<RateResponse | null>(null);
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch rate history with user-specific cache key
  const {
    data: history,
    isLoading: historyLoading,
    error: historyError,
  } = useQuery({
    queryKey: ['rateHistory', user?.id],
    queryFn: () => apiClient.getRateHistory(),
    enabled: isAuthenticated && !!user?.id,
    retry: (failureCount, error) => {
      // Don't retry on 401/403 errors
      if (error && typeof error === 'object' && 'status' in error) {
        const status = (error as { status: number }).status;
        if (status === 401 || status === 403) {
          return false;
        }
      }
      return failureCount < 3;
    },
  });

  const mutation = useMutation({
    mutationFn: (data: RateRequest) => {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to calculate rates');
      }
      return apiClient.calculateRate(data);
    },
    onSuccess: data => {
      setResults(data);
      // Invalidate history cache to refresh the list (user-specific)
      queryClient.invalidateQueries({ queryKey: ['rateHistory', user?.id] });
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
    history: history?.items ?? [],
    historyLoading,
    historyError: historyError ? handleApiError(historyError) : null,
  };
}
