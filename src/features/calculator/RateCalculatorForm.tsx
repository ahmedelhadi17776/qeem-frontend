'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Card, CardHeader, CardBody } from '@/components/ui';
import { useRateCalculation } from '@/hooks/useRateCalculation';
import { RateRequest } from '@/types/api';

const rateCalculatorSchema = z.object({
  project_type: z.enum([
    'web_development',
    'mobile_development',
    'design',
    'writing',
    'marketing',
    'consulting',
    'data_analysis',
    'other',
  ]),
  project_complexity: z.enum(['simple', 'moderate', 'complex', 'enterprise']),
  estimated_hours: z
    .number()
    .min(1, 'Estimated hours must be at least 1')
    .max(2000, 'Estimated hours cannot exceed 2000'),
  experience_years: z
    .number()
    .min(0, 'Experience years cannot be negative')
    .max(50, 'Experience years cannot exceed 50'),
  skills_count: z.number().min(0, 'Skills count cannot be negative').max(100, 'Skills count cannot exceed 100'),
  location: z.string().min(1, 'Location is required'),
  client_region: z.enum(['egypt', 'mena', 'europe', 'usa', 'global']),
  urgency: z.enum(['normal', 'rush']),
});

type RateCalculatorFormData = z.infer<typeof rateCalculatorSchema>;

const projectTypes = [
  { value: 'web_development', label: 'Web Development' },
  { value: 'mobile_development', label: 'Mobile Development' },
  { value: 'design', label: 'Design' },
  { value: 'writing', label: 'Writing' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'data_analysis', label: 'Data Analysis' },
  { value: 'other', label: 'Other' },
];

const complexityLevels = [
  { value: 'simple', label: 'Simple' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'complex', label: 'Complex' },
  { value: 'enterprise', label: 'Enterprise' },
];

const clientRegions = [
  { value: 'egypt', label: 'Egypt' },
  { value: 'mena', label: 'MENA Region' },
  { value: 'europe', label: 'Europe' },
  { value: 'usa', label: 'USA' },
  { value: 'global', label: 'Global' },
];

const urgencyLevels = [
  { value: 'normal', label: 'Normal' },
  { value: 'rush', label: 'Rush' },
];

export function RateCalculatorForm() {
  const { calculateRate, loading, error, results, isAuthenticated } = useRateCalculation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RateCalculatorFormData>({
    resolver: zodResolver(rateCalculatorSchema),
    defaultValues: {
      project_type: 'web_development',
      project_complexity: 'moderate',
      estimated_hours: 40,
      experience_years: 2,
      skills_count: 3,
      location: 'Cairo, Egypt',
      client_region: 'egypt',
      urgency: 'normal',
    },
  });

  const onSubmit = (data: RateCalculatorFormData) => {
    calculateRate(data as RateRequest);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <h1 className="text-3xl font-extrabold text-text-main dark:text-slate-100 mb-2">Rate Calculator</h1>
          <p className="text-text-body dark:text-slate-300">
            Calculate your freelance rate based on your skills and experience.
          </p>
          {isAuthenticated && (
            <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-md">
              <p className="text-accent text-sm font-medium">
                ✓ You&apos;re logged in! Your calculations will be saved to your history.
              </p>
            </div>
          )}
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="project_type" className="text-sm font-semibold text-text-main dark:text-slate-100">
                  Project Type
                </label>
                <select
                  id="project_type"
                  className="w-full bg-surface dark:bg-slate-800 border-2 border-border dark:border-slate-600 rounded-md px-4 py-3.5 text-base text-text-main dark:text-slate-100 font-inherit transition-all duration-DEFAULT ease-out placeholder:text-text-muted dark:placeholder:text-slate-400 placeholder:opacity-70 focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-bg dark:disabled:bg-slate-900"
                  {...register('project_type')}
                >
                  <option value="">Select project type</option>
                  {projectTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.project_type && (
                  <span className="block mt-1 text-sm text-danger">{errors.project_type.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="project_complexity"
                  className="text-sm font-semibold text-text-main dark:text-slate-100"
                >
                  Project Complexity
                </label>
                <select
                  id="project_complexity"
                  className="w-full bg-surface dark:bg-slate-800 border-2 border-border dark:border-slate-600 rounded-md px-4 py-3.5 text-base text-text-main dark:text-slate-100 font-inherit transition-all duration-DEFAULT ease-out placeholder:text-text-muted dark:placeholder:text-slate-400 placeholder:opacity-70 focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-bg dark:disabled:bg-slate-900"
                  {...register('project_complexity')}
                >
                  <option value="">Select complexity</option>
                  {complexityLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
                {errors.project_complexity && (
                  <span className="block mt-1 text-sm text-danger">{errors.project_complexity.message}</span>
                )}
              </div>

              <Input
                label="Estimated Hours"
                type="number"
                {...register('estimated_hours', { valueAsNumber: true })}
                error={errors.estimated_hours?.message}
              />

              <Input
                label="Years of Experience"
                type="number"
                {...register('experience_years', { valueAsNumber: true })}
                error={errors.experience_years?.message}
              />

              <Input
                label="Number of Skills"
                type="number"
                {...register('skills_count', { valueAsNumber: true })}
                error={errors.skills_count?.message}
              />

              <Input label="Location" {...register('location')} error={errors.location?.message} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="client_region" className="text-sm font-semibold text-text-main dark:text-slate-100">
                  Client Region
                </label>
                <select
                  id="client_region"
                  className="w-full bg-surface dark:bg-slate-800 border-2 border-border dark:border-slate-600 rounded-md px-4 py-3.5 text-base text-text-main dark:text-slate-100 font-inherit transition-all duration-DEFAULT ease-out placeholder:text-text-muted dark:placeholder:text-slate-400 placeholder:opacity-70 focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-bg dark:disabled:bg-slate-900"
                  {...register('client_region')}
                >
                  {clientRegions.map(region => (
                    <option key={region.value} value={region.value}>
                      {region.label}
                    </option>
                  ))}
                </select>
                {errors.client_region && (
                  <span className="block mt-1 text-sm text-danger">{errors.client_region.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="urgency" className="text-sm font-semibold text-text-main dark:text-slate-100">
                  Project Urgency
                </label>
                <select
                  id="urgency"
                  className="w-full bg-surface dark:bg-slate-800 border-2 border-border dark:border-slate-600 rounded-md px-4 py-3.5 text-base text-text-main dark:text-slate-100 font-inherit transition-all duration-DEFAULT ease-out placeholder:text-text-muted dark:placeholder:text-slate-400 placeholder:opacity-70 focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-bg dark:disabled:bg-slate-900"
                  {...register('urgency')}
                >
                  {urgencyLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
                {errors.urgency && <span className="block mt-1 text-sm text-danger">{errors.urgency.message}</span>}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-danger/10 border border-danger rounded-md">
                <p className="text-danger text-sm">{error}</p>
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full">
              Calculate My Rate
            </Button>
          </form>

          {results && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-text-main dark:text-slate-100 mb-6">Your Rate Recommendations</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-surface dark:bg-slate-800 border border-border dark:border-slate-600 rounded-lg p-6 rate-card tier-minimum">
                  <h3 className="text-lg font-semibold text-text-main dark:text-slate-100 mb-2">Minimum Rate</h3>
                  <div className="text-3xl font-extrabold font-mono text-accent mb-2">
                    {results.minimum_rate} {results.currency}
                  </div>
                  <p className="text-text-muted dark:text-slate-400 text-sm">Basic rate for this project</p>
                </div>
                <div className="bg-surface dark:bg-slate-800 border border-border dark:border-slate-600 rounded-lg p-6 rate-card tier-competitive">
                  <h3 className="text-lg font-semibold text-text-main dark:text-slate-100 mb-2">Competitive Rate</h3>
                  <div className="text-3xl font-extrabold font-mono text-accent mb-2">
                    {results.competitive_rate} {results.currency}
                  </div>
                  <p className="text-text-muted dark:text-slate-400 text-sm">
                    Recommended rate for market competitiveness
                  </p>
                </div>
                <div className="bg-surface dark:bg-slate-800 border border-border dark:border-slate-600 rounded-lg p-6 rate-card tier-premium">
                  <h3 className="text-lg font-semibold text-text-main dark:text-slate-100 mb-2">Premium Rate</h3>
                  <div className="text-3xl font-extrabold font-mono text-accent mb-2">
                    {results.premium_rate} {results.currency}
                  </div>
                  <p className="text-text-muted dark:text-slate-400 text-sm">Premium rate for high-value clients</p>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
