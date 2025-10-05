'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Card, CardHeader, CardBody } from '@/components/ui';
import { useRateCalculation } from '@/hooks/useRateCalculation';
import { RateRequest } from '@/types/api';

const rateCalculatorSchema = z.object({
  project_type: z.string().min(1, 'Project type is required'),
  project_complexity: z.string().min(1, 'Project complexity is required'),
  estimated_hours: z.number().min(1, 'Estimated hours must be at least 1'),
  experience_years: z.number().min(0, 'Experience years cannot be negative'),
  skills_count: z.number().min(1, 'Skills count must be at least 1'),
  location: z.string().min(1, 'Location is required'),
});

type RateCalculatorFormData = z.infer<typeof rateCalculatorSchema>;

const projectTypes = [
  { value: 'web_development', label: 'Web Development' },
  { value: 'mobile_development', label: 'Mobile Development' },
  { value: 'data_science', label: 'Data Science' },
  { value: 'design', label: 'Design' },
  { value: 'writing', label: 'Writing' },
  { value: 'marketing', label: 'Marketing' },
];

const complexityLevels = [
  { value: 'simple', label: 'Simple' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'complex', label: 'Complex' },
  { value: 'enterprise', label: 'Enterprise' },
];

export function RateCalculatorForm() {
  const { calculateRate, loading, error, results } = useRateCalculation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RateCalculatorFormData>({
    resolver: zodResolver(rateCalculatorSchema),
    defaultValues: {
      project_type: '',
      project_complexity: '',
      estimated_hours: 40,
      experience_years: 2,
      skills_count: 3,
      location: 'Cairo, Egypt',
    },
  });

  const onSubmit = (data: RateCalculatorFormData) => {
    calculateRate(data as RateRequest);
  };

  return (
    <div className='max-w-4xl mx-auto'>
      <Card>
        <CardHeader>
          <h1 className='text-3xl font-extrabold text-text-main mb-2'>
            Rate Calculator
          </h1>
          <p className='text-text-body'>
            Calculate your freelance rate based on your skills and experience.
          </p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='flex flex-col gap-2'>
                <label
                  htmlFor='project_type'
                  className='text-sm font-semibold text-text-main'
                >
                  Project Type
                </label>
                <select
                  id='project_type'
                  className='w-full bg-surface border-2 border-border rounded-md px-4 py-3.5 text-base text-text-main font-inherit transition-all duration-DEFAULT ease-out placeholder:text-text-muted placeholder:opacity-70 focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-bg'
                  {...register('project_type')}
                >
                  <option value=''>Select project type</option>
                  {projectTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.project_type && (
                  <span className='block mt-1 text-sm text-danger'>
                    {errors.project_type.message}
                  </span>
                )}
              </div>

              <div className='flex flex-col gap-2'>
                <label
                  htmlFor='project_complexity'
                  className='text-sm font-semibold text-text-main'
                >
                  Project Complexity
                </label>
                <select
                  id='project_complexity'
                  className='w-full bg-surface border-2 border-border rounded-md px-4 py-3.5 text-base text-text-main font-inherit transition-all duration-DEFAULT ease-out placeholder:text-text-muted placeholder:opacity-70 focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-bg'
                  {...register('project_complexity')}
                >
                  <option value=''>Select complexity</option>
                  {complexityLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
                {errors.project_complexity && (
                  <span className='block mt-1 text-sm text-danger'>
                    {errors.project_complexity.message}
                  </span>
                )}
              </div>

              <Input
                label='Estimated Hours'
                type='number'
                {...register('estimated_hours', { valueAsNumber: true })}
                error={errors.estimated_hours?.message}
              />

              <Input
                label='Years of Experience'
                type='number'
                {...register('experience_years', { valueAsNumber: true })}
                error={errors.experience_years?.message}
              />

              <Input
                label='Number of Skills'
                type='number'
                {...register('skills_count', { valueAsNumber: true })}
                error={errors.skills_count?.message}
              />

              <Input
                label='Location'
                {...register('location')}
                error={errors.location?.message}
              />
            </div>

            {error && (
              <div className='p-3 bg-danger/10 border border-danger rounded-md'>
                <p className='text-danger text-sm'>{error}</p>
              </div>
            )}

            <Button type='submit' loading={loading} className='w-full'>
              Calculate My Rate
            </Button>
          </form>

          {results && (
            <div className='mt-8'>
              <h2 className='text-2xl font-bold text-text-main mb-6'>
                Your Rate Recommendations
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='bg-surface border border-border rounded-lg p-6 rate-card tier-minimum'>
                  <h3 className='text-lg font-semibold text-text-main mb-2'>
                    Minimum Rate
                  </h3>
                  <div className='text-3xl font-extrabold font-mono text-accent mb-2'>
                    {results.minimum_rate} {results.currency}
                  </div>
                  <p className='text-text-muted text-sm'>
                    Basic rate for this project
                  </p>
                </div>
                <div className='bg-surface border border-border rounded-lg p-6 rate-card tier-competitive'>
                  <h3 className='text-lg font-semibold text-text-main mb-2'>
                    Competitive Rate
                  </h3>
                  <div className='text-3xl font-extrabold font-mono text-accent mb-2'>
                    {results.competitive_rate} {results.currency}
                  </div>
                  <p className='text-text-muted text-sm'>
                    Recommended rate for market competitiveness
                  </p>
                </div>
                <div className='bg-surface border border-border rounded-lg p-6 rate-card tier-premium'>
                  <h3 className='text-lg font-semibold text-text-main mb-2'>
                    Premium Rate
                  </h3>
                  <div className='text-3xl font-extrabold font-mono text-accent mb-2'>
                    {results.premium_rate} {results.currency}
                  </div>
                  <p className='text-text-muted text-sm'>
                    Premium rate for high-value clients
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
