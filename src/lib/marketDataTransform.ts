import { MarketStatisticsItem, MarketTrendsPoint } from '@/types/api';

// Transform backend MarketStatisticsItem to frontend chart format
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  maxValue?: number;
}

export interface MarketInsights {
  totalJobs: number;
  averageRate: number;
  growthRate: number;
  highDemandSkills: number;
  totalSkills: number;
  growingSkills: number;
}

// Transform MarketStatisticsItem to chart format
export function transformStatisticsToChart(
  items: MarketStatisticsItem[],
  groupBy: 'project_type' | 'location' = 'project_type',
): ChartDataPoint[] {
  const grouped = items.reduce(
    (acc, item) => {
      const key = item[groupBy];
      if (!acc[key]) {
        acc[key] = {
          total: 0,
          count: 0,
          min: item.min_rate,
          max: item.max_rate,
        };
      }
      acc[key].total += item.average_rate;
      acc[key].count += 1;
      acc[key].min = Math.min(acc[key].min, item.min_rate);
      acc[key].max = Math.max(acc[key].max, item.max_rate);
      return acc;
    },
    {} as Record<string, { total: number; count: number; min: number; max: number }>,
  );

  return Object.entries(grouped).map(([label, data]) => ({
    label,
    value: Math.round(data.total / data.count),
    color: getColorForCategory(label),
  }));
}

// Get color for different categories
function getColorForCategory(category: string): string {
  const colorMap: Record<string, string> = {
    web_development: 'bg-blue-500',
    mobile_development: 'bg-purple-500',
    design: 'bg-pink-500',
    writing: 'bg-green-500',
    marketing: 'bg-orange-500',
    consulting: 'bg-indigo-500',
    data_analysis: 'bg-teal-500',
    other: 'bg-gray-500',
    // Location-based colors
    cairo: 'bg-accent',
    alexandria: 'bg-blue-500',
    giza: 'bg-green-500',
    egypt: 'bg-accent',
    mena: 'bg-purple-500',
    europe: 'bg-blue-500',
    usa: 'bg-red-500',
    global: 'bg-gray-500',
  };

  return colorMap[category.toLowerCase()] || 'bg-accent';
}

// Calculate market insights from statistics and trends
export function calculateMarketInsights(
  statistics: MarketStatisticsItem[],
  trends: MarketTrendsPoint[],
): MarketInsights {
  if (statistics.length === 0) {
    return {
      totalJobs: 0,
      averageRate: 0,
      growthRate: 0,
      highDemandSkills: 0,
      totalSkills: 0,
      growingSkills: 0,
    };
  }

  // Calculate average rate
  const totalRate = statistics.reduce((sum, item) => sum + item.average_rate, 0);
  const averageRate = Math.round(totalRate / statistics.length);

  // Calculate growth rate from trends
  let growthRate = 0;
  if (trends.length >= 2) {
    const latest = trends[trends.length - 1];
    const previous = trends[trends.length - 2];
    growthRate = Math.round(((latest.average_rate - previous.average_rate) / previous.average_rate) * 100);
  }

  // Count unique project types as skills
  const uniqueSkills = new Set(statistics.map(item => item.project_type));
  const totalSkills = uniqueSkills.size;

  // Count high demand skills (above average rate)
  const highDemandSkills = statistics.filter(item => item.average_rate > averageRate).length;

  // Estimate total jobs (simplified calculation)
  const totalJobs = statistics.reduce((sum, item) => sum + (item.demand_score ?? 1) * 100, 0);

  // Count growing skills (positive growth trend)
  const growingSkills = trends.filter(point => (point.market_trend ?? '').includes('up')).length;

  return {
    totalJobs: Math.round(totalJobs),
    averageRate,
    growthRate: Math.max(0, growthRate),
    highDemandSkills,
    totalSkills,
    growingSkills,
  };
}

// Transform trends data for time series charts
export function transformTrendsToTimeSeries(trends: MarketTrendsPoint[]): ChartDataPoint[] {
  return trends.map(point => ({
    label: new Date(point.period_start).toLocaleDateString(),
    value: Math.round(point.average_rate),
    color: 'bg-accent',
  }));
}

// Get skill demand level based on rate
export function getDemandLevel(rate: number, averageRate: number): 'low' | 'medium' | 'high' {
  const ratio = rate / averageRate;
  if (ratio >= 1.2) return 'high';
  if (ratio >= 0.8) return 'medium';
  return 'low';
}

// Format currency for display
export function formatCurrency(amount: number, currency: string = 'EGP'): string {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Get trend direction from market trend string
export function getTrendDirection(trend: string | undefined): 'up' | 'down' | 'stable' {
  if (!trend) return 'stable';
  const lowerTrend = trend.toLowerCase();
  if (lowerTrend.includes('up') || lowerTrend.includes('rising') || lowerTrend.includes('growing')) {
    return 'up';
  }
  if (lowerTrend.includes('down') || lowerTrend.includes('falling') || lowerTrend.includes('declining')) {
    return 'down';
  }
  return 'stable';
}
