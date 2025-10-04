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
    <div className='container'>
      <Card>
        <CardHeader>
          <h1 className='card-title'>Rate Calculator</h1>
          <p>
            Calculate your freelance rate based on your skills and experience.
          </p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='form-grid'>
              <div className='form-group'>
                <label htmlFor='project_type' className='input-label'>
                  Project Type
                </label>
                <select
                  id='project_type'
                  className='input-field'
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
                  <span className='input-error'>
                    {errors.project_type.message}
                  </span>
                )}
              </div>

              <div className='form-group'>
                <label htmlFor='project_complexity' className='input-label'>
                  Project Complexity
                </label>
                <select
                  id='project_complexity'
                  className='input-field'
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
                  <span className='input-error'>
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
              <div className='error-message'>
                <p>{error}</p>
              </div>
            )}

            <Button type='submit' loading={loading} className='w-full'>
              Calculate My Rate
            </Button>
          </form>

          {results && (
            <div className='results-section'>
              <h2>Your Rate Recommendations</h2>
              <div className='rate-cards'>
                <div className='rate-card tier-minimum'>
                  <h3>Minimum Rate</h3>
                  <div className='rate-amount'>
                    {results.minimum_rate} {results.currency}
                  </div>
                  <p>Basic rate for this project</p>
                </div>
                <div className='rate-card tier-competitive'>
                  <h3>Competitive Rate</h3>
                  <div className='rate-amount'>
                    {results.competitive_rate} {results.currency}
                  </div>
                  <p>Recommended rate for market competitiveness</p>
                </div>
                <div className='rate-card tier-premium'>
                  <h3>Premium Rate</h3>
                  <div className='rate-amount'>
                    {results.premium_rate} {results.currency}
                  </div>
                  <p>Premium rate for high-value clients</p>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
