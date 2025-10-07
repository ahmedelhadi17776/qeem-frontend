'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { StatCard, HorizontalBarChart } from '@/components/charts';
import { useMarketDataByCategory } from '@/hooks/useMarketData';
import {
  getSkillRates,
  getTopSkillsByDemand,
  getFastestGrowingSkills,
  getRegionalComparison,
  getMarketInsights,
} from '@/lib/mockData';
import {
  transformStatisticsToChart,
  calculateMarketInsights,
  transformTrendsToTimeSeries,
} from '@/lib/marketDataTransform';

// Dynamic imports for better performance
const CardComponent = dynamic(() => import('@/components/ui').then(mod => ({ default: mod.Card })), { ssr: true });
const CardHeaderComponent = dynamic(() => import('@/components/ui').then(mod => ({ default: mod.CardHeader })), {
  ssr: true,
});
const CardBodyComponent = dynamic(() => import('@/components/ui').then(mod => ({ default: mod.CardBody })), {
  ssr: true,
});

type SkillFilter = 'all' | 'tech' | 'design' | 'marketing';

export default function MarketPage() {
  const [skillFilter, setSkillFilter] = useState<SkillFilter>('all');

  // Use real API data with fallback to mock data
  const { statistics, trends, isLoading, error } = useMarketDataByCategory(skillFilter);

  // Transform real data or use mock data as fallback
  const realMarketInsights =
    statistics.data && trends.data ? calculateMarketInsights(statistics.data.items, trends.data.points) : null;

  const realFilteredSkills = statistics.data ? transformStatisticsToChart(statistics.data.items, 'project_type') : null;

  const realTopSkills = trends.data ? transformTrendsToTimeSeries(trends.data.points).slice(0, 8) : null;

  // Fallback to mock data if API fails or no data
  const marketInsights = realMarketInsights ?? getMarketInsights();
  const filteredSkills = realFilteredSkills ?? getSkillRates(skillFilter);
  const topSkills = realTopSkills ?? getTopSkillsByDemand(8);
  const growingSkills = getFastestGrowingSkills(5); // Keep mock for now
  const regionalRates = getRegionalComparison(); // Keep mock for now

  const skillFilters = [
    { value: 'all', label: 'All Skills' },
    { value: 'tech', label: 'Technology' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-main dark:text-slate-100 mb-2">Market Insights</h1>
        <p className="text-text-body dark:text-slate-300">Discover current market trends and rates</p>
        {isLoading && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">🔄 Loading real-time market data...</p>
          </div>
        )}

        {error && !statistics.data && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <p className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">
              ⚠️ Using mock data due to API error. Real-time data will be available when the backend is running.
            </p>
          </div>
        )}

        {!isLoading && !error && statistics.data && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <p className="text-green-600 dark:text-green-400 text-sm font-medium">
              ✅ Using real-time market data
              {statistics.data.cached && ' (cached)'}
            </p>
          </div>
        )}

        {!isLoading && !error && !statistics.data && (
          <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-md">
            <p className="text-accent text-sm font-medium">
              📊 Using mock data for demonstration. Real-time market data will be integrated in Phase 2.
            </p>
          </div>
        )}
      </div>

      {/* Market Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Active Jobs"
          value={marketInsights.totalJobs.toLocaleString()}
          subtitle="Freelance opportunities"
          trend={{ value: marketInsights.growthRate, direction: 'up' }}
          icon="💼"
        />
        <StatCard
          title="Average Rate"
          value={`${marketInsights.averageRate} EGP`}
          subtitle="Per hour"
          trend={{ value: 8.5, direction: 'up' }}
          icon="💰"
        />
        <StatCard
          title="High Demand Skills"
          value={marketInsights.highDemandSkills}
          subtitle={`of ${marketInsights.totalSkills} categories`}
          trend={{ value: 15, direction: 'up' }}
          icon="📈"
        />
        <StatCard
          title="Growing Skills"
          value={marketInsights.growingSkills}
          subtitle="Trending upward"
          trend={{ value: 22, direction: 'up' }}
          icon="🚀"
        />
      </div>

      {/* Skill Categories Filter */}
      <CardComponent>
        <CardHeaderComponent>
          <h2 className="text-xl font-semibold text-text-main dark:text-slate-100">Average Rates by Skill</h2>
          <p className="text-text-body dark:text-slate-300">Filter by skill category to see detailed rates</p>
        </CardHeaderComponent>
        <CardBodyComponent>
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {skillFilters.map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setSkillFilter(filter.value as SkillFilter)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    skillFilter === filter.value
                      ? 'bg-accent text-white'
                      : 'bg-surface dark:bg-slate-800 text-text-main dark:text-slate-100 border border-border dark:border-slate-600 hover:bg-accent/10'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <HorizontalBarChart
            data={filteredSkills.map(skill => ({
              label: 'skill' in skill ? skill.skill : skill.label,
              value: 'rate' in skill ? skill.rate : skill.value,
              color:
                'demand' in skill && skill.demand === 'high'
                  ? 'bg-green-500'
                  : 'demand' in skill && skill.demand === 'medium'
                    ? 'bg-yellow-500'
                    : 'color' in skill
                      ? skill.color
                      : 'bg-red-500',
            }))}
            title={`${skillFilters.find(f => f.value === skillFilter)?.label} Rates (EGP/hour)`}
            showValues={true}
          />
        </CardBodyComponent>
      </CardComponent>

      {/* Top Skills and Regional Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Skills by Demand */}
        <CardComponent>
          <CardHeaderComponent>
            <h2 className="text-xl font-semibold text-text-main dark:text-slate-100">Top Skills in Demand</h2>
            <p className="text-text-body dark:text-slate-300">Most requested skills in the market</p>
          </CardHeaderComponent>
          <CardBodyComponent>
            <HorizontalBarChart
              data={topSkills.map(skill => ({
                label: 'name' in skill ? skill.name : skill.label,
                value: 'demand' in skill ? skill.demand : skill.value,
                color: 'bg-blue-500',
              }))}
              title="Demand Score (%)"
              showValues={true}
              height={350}
            />
          </CardBodyComponent>
        </CardComponent>

        {/* Regional Rate Comparison */}
        <CardComponent>
          <CardHeaderComponent>
            <h2 className="text-xl font-semibold text-text-main dark:text-slate-100">Regional Rate Comparison</h2>
            <p className="text-text-body dark:text-slate-300">Average rates across different regions</p>
          </CardHeaderComponent>
          <CardBodyComponent>
            <HorizontalBarChart
              data={regionalRates.map(region => ({
                label: region.region,
                value: region.rate,
                color: region.region === 'Egypt' ? 'bg-accent' : 'bg-purple-500',
              }))}
              title="Average Hourly Rate"
              showValues={true}
              height={350}
            />
            <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-700 rounded-md">
              <p className="text-xs text-text-muted dark:text-slate-400">
                * Rates shown in local currencies. Conversion rates may vary.
              </p>
            </div>
          </CardBodyComponent>
        </CardComponent>
      </div>

      {/* Fastest Growing Skills */}
      <CardComponent>
        <CardHeaderComponent>
          <h2 className="text-xl font-semibold text-text-main dark:text-slate-100">Fastest Growing Skills</h2>
          <p className="text-text-body dark:text-slate-300">Skills with the highest growth in demand</p>
        </CardHeaderComponent>
        <CardBodyComponent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {growingSkills.map(skill => (
              <div key={skill.name} className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-text-main dark:text-slate-100">{skill.name}</h3>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">+{skill.growth}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted dark:text-slate-400">Demand Score:</span>
                  <span className="text-text-main dark:text-slate-100">{skill.demand}%</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${skill.demand}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardBodyComponent>
      </CardComponent>

      {/* Market Trends */}
      <CardComponent>
        <CardHeaderComponent>
          <h2 className="text-xl font-semibold text-text-main dark:text-slate-100">Market Trends</h2>
          <p className="text-text-body dark:text-slate-300">Key insights and predictions</p>
        </CardHeaderComponent>
        <CardBodyComponent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="font-semibold text-text-main dark:text-slate-100 mb-2">Market Growth</h3>
              <p className="text-sm text-text-body dark:text-slate-300">
                The freelance market is growing at {marketInsights.growthRate}% annually, with technology skills leading
                the demand.
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-text-main dark:text-slate-100 mb-2">Skill Specialization</h3>
              <p className="text-sm text-text-body dark:text-slate-300">
                Specialized skills like DevOps and Machine Learning command premium rates up to 500 EGP/hour.
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="font-semibold text-text-main dark:text-slate-100 mb-2">Global Opportunities</h3>
              <p className="text-sm text-text-body dark:text-slate-300">
                International clients offer 2-3x higher rates, with European and US markets being most lucrative.
              </p>
            </div>
          </div>
        </CardBodyComponent>
      </CardComponent>
    </div>
  );
}
