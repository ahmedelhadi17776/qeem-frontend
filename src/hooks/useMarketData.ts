import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { MarketStatisticsQuery, MarketTrendsQuery } from '@/types/api';

export function useMarketStatistics(query: MarketStatisticsQuery = {}) {
  return useQuery({
    queryKey: ['market-statistics', query],
    queryFn: () => apiClient.getMarketStatistics(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error && typeof error === 'object' && 'status' in error) {
        const status = (error as { status: number }).status;
        if (status >= 400 && status < 500) {
          return false;
        }
      }
      return failureCount < 2;
    },
  });
}

export function useMarketTrends(query: MarketTrendsQuery = {}) {
  return useQuery({
    queryKey: ['market-trends', query],
    queryFn: () => apiClient.getMarketTrends(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error && typeof error === 'object' && 'status' in error) {
        const status = (error as { status: number }).status;
        if (status >= 400 && status < 500) {
          return false;
        }
      }
      return failureCount < 2;
    },
  });
}

// Hook for getting market data for different skill categories
export function useMarketDataByCategory(category: 'tech' | 'design' | 'marketing' | 'all' = 'all') {
  const projectTypeMap = {
    tech: 'web_development',
    design: 'design',
    marketing: 'marketing',
    all: undefined,
  };

  const statisticsQuery = useMarketStatistics({
    project_type: projectTypeMap[category],
    period_type: 'weekly',
    limit: 20,
  });

  const trendsQuery = useMarketTrends({
    project_type: projectTypeMap[category],
    period_type: 'weekly',
    window: 12,
  });

  return {
    statistics: statisticsQuery,
    trends: trendsQuery,
    isLoading: statisticsQuery.isLoading || trendsQuery.isLoading,
    error: statisticsQuery.error ?? trendsQuery.error,
  };
}
