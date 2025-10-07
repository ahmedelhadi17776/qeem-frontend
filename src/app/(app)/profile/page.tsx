'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dynamic from 'next/dynamic';
import { Button, Input } from '@/components/ui';
import { useUserProfile } from '@/hooks/useUserProfile';

// Dynamic imports for better performance
const CardComponent = dynamic(() => import('@/components/ui').then(mod => ({ default: mod.Card })), { ssr: true });
const CardHeaderComponent = dynamic(() => import('@/components/ui').then(mod => ({ default: mod.CardHeader })), {
  ssr: true,
});
const CardBodyComponent = dynamic(() => import('@/components/ui').then(mod => ({ default: mod.CardBody })), {
  ssr: true,
});

const profileSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100, 'First name is too long'),
  last_name: z.string().min(1, 'Last name is required').max(100, 'Last name is too long'),
  phone: z.string().max(20, 'Phone number is too long').optional().or(z.literal('')),
  bio: z.string().max(500, 'Bio is too long').optional().or(z.literal('')),
  profession: z.string().max(100, 'Profession is too long').optional().or(z.literal('')),
  experience_years: z
    .number()
    .min(0, 'Experience cannot be negative')
    .max(50, 'Experience cannot exceed 50 years')
    .optional(),
  skills: z.string().optional().or(z.literal('')),
  portfolio_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  linkedin_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  city: z.string().max(100, 'City name is too long').optional().or(z.literal('')),
  country: z.string().max(100, 'Country name is too long').optional().or(z.literal('')),
  preferred_currency: z.enum(['EGP', 'USD', 'EUR']).optional(),
  hourly_rate_preference: z.number().min(0, 'Rate cannot be negative').optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { profile, isLoading, error, updateProfile, updateProfileLoading } = useUserProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile?.first_name ?? '',
      last_name: profile?.last_name ?? '',
      phone: profile?.phone ?? '',
      bio: profile?.bio ?? '',
      profession: profile?.profession ?? '',
      experience_years: profile?.experience_years ?? undefined,
      skills: profile?.skills ?? '',
      portfolio_url: profile?.portfolio_url ?? '',
      linkedin_url: profile?.linkedin_url ?? '',
      city: profile?.city ?? '',
      country: profile?.country ?? '',
      preferred_currency: (profile?.preferred_currency as 'EGP' | 'USD' | 'EUR') ?? 'EGP',
      hourly_rate_preference: profile?.hourly_rate_preference ?? undefined,
    },
  });

  // Reset form when profile data loads
  React.useEffect(() => {
    if (profile) {
      reset({
        first_name: profile.first_name ?? '',
        last_name: profile.last_name ?? '',
        phone: profile.phone ?? '',
        bio: profile.bio ?? '',
        profession: profile.profession ?? '',
        experience_years: profile.experience_years ?? undefined,
        skills: profile.skills ?? '',
        portfolio_url: profile.portfolio_url ?? '',
        linkedin_url: profile.linkedin_url ?? '',
        city: profile.city ?? '',
        country: profile.country ?? '',
        preferred_currency: (profile.preferred_currency as 'EGP' | 'USD' | 'EUR') ?? 'EGP',
        hourly_rate_preference: profile.hourly_rate_preference ?? undefined,
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setSuccessMessage(null);

      // Convert empty strings to null for optional fields
      const updateData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value === '' ? null : value]),
      );

      await updateProfile(updateData);
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Profile update failed:', err);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
    setSuccessMessage(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-text-main dark:text-slate-100 mb-2">Profile Settings</h1>
          <p className="text-text-body dark:text-slate-300">Manage your account and preferences</p>
        </div>
        <CardComponent>
          <CardBodyComponent>
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
              <span className="ml-2 text-text-body dark:text-slate-300">Loading profile...</span>
            </div>
          </CardBodyComponent>
        </CardComponent>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-text-main dark:text-slate-100 mb-2">Profile Settings</h1>
          <p className="text-text-body dark:text-slate-300">Manage your account and preferences</p>
        </div>
        <CardComponent>
          <CardBodyComponent>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h2 className="text-xl font-semibold text-text-main dark:text-slate-100 mb-2">Error Loading Profile</h2>
              <p className="text-text-body dark:text-slate-300 max-w-md mx-auto">{error}</p>
            </div>
          </CardBodyComponent>
        </CardComponent>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-main dark:text-slate-100 mb-2">Profile Settings</h1>
          <p className="text-text-body dark:text-slate-300">Manage your account and preferences</p>
        </div>
        {!isEditing && <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>}
      </div>

      {successMessage && (
        <div className="p-4 bg-accent/10 border border-accent rounded-md">
          <p className="text-accent text-sm font-medium">{successMessage}</p>
        </div>
      )}

      <CardComponent>
        <CardHeaderComponent>
          <h2 className="text-xl font-semibold text-text-main dark:text-slate-100">Personal Information</h2>
        </CardHeaderComponent>
        <CardBodyComponent>
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  {...register('first_name')}
                  error={errors.first_name?.message}
                  placeholder="John"
                />

                <Input
                  label="Last Name"
                  {...register('last_name')}
                  error={errors.last_name?.message}
                  placeholder="Doe"
                />

                <Input
                  label="Phone"
                  {...register('phone')}
                  error={errors.phone?.message}
                  placeholder="+20 123 456 7890"
                />

                <Input label="Email" value={profile?.email ?? ''} disabled helperText="Email cannot be changed" />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-semibold text-text-main dark:text-slate-100 mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  {...register('bio')}
                  rows={4}
                  className="w-full bg-surface dark:bg-slate-800 border-2 border-border dark:border-slate-600 rounded-md px-4 py-3.5 text-base text-text-main dark:text-slate-100 font-inherit transition-all duration-DEFAULT ease-out placeholder:text-text-muted dark:placeholder:text-slate-400 placeholder:opacity-70 focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none"
                  placeholder="Tell us about yourself..."
                />
                {errors.bio && <span className="block mt-1 text-sm text-danger">{errors.bio.message}</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="City" {...register('city')} error={errors.city?.message} placeholder="Cairo" />

                <Input label="Country" {...register('country')} error={errors.country?.message} placeholder="Egypt" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-text-main dark:text-slate-100 mb-4">
                  Professional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Profession"
                    {...register('profession')}
                    error={errors.profession?.message}
                    placeholder="Web Developer"
                  />

                  <Input
                    label="Years of Experience"
                    type="number"
                    {...register('experience_years', { valueAsNumber: true })}
                    error={errors.experience_years?.message}
                    placeholder="3"
                  />

                  <Input
                    label="Skills (comma-separated)"
                    {...register('skills')}
                    error={errors.skills?.message}
                    placeholder="React, Node.js, Python"
                  />

                  <div>
                    <label
                      htmlFor="preferred_currency"
                      className="block text-sm font-semibold text-text-main dark:text-slate-100 mb-2"
                    >
                      Preferred Currency
                    </label>
                    <select
                      id="preferred_currency"
                      {...register('preferred_currency')}
                      className="w-full bg-surface dark:bg-slate-800 border-2 border-border dark:border-slate-600 rounded-md px-4 py-3.5 text-base text-text-main dark:text-slate-100 font-inherit transition-all duration-DEFAULT ease-out focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none"
                    >
                      <option value="EGP">EGP (Egyptian Pound)</option>
                      <option value="USD">USD (US Dollar)</option>
                      <option value="EUR">EUR (Euro)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-text-main dark:text-slate-100 mb-4">Links & Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Portfolio URL"
                    {...register('portfolio_url')}
                    error={errors.portfolio_url?.message}
                    placeholder="https://yourportfolio.com"
                  />

                  <Input
                    label="LinkedIn URL"
                    {...register('linkedin_url')}
                    error={errors.linkedin_url?.message}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />

                  <Input
                    label="Hourly Rate Preference (EGP)"
                    type="number"
                    {...register('hourly_rate_preference', { valueAsNumber: true })}
                    error={errors.hourly_rate_preference?.message}
                    placeholder="250"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border dark:border-slate-600">
                <Button type="button" variant="secondary" onClick={handleCancel} disabled={updateProfileLoading}>
                  Cancel
                </Button>
                <Button type="submit" loading={updateProfileLoading} disabled={!isDirty}>
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-muted dark:text-slate-400 mb-1">Name</label>
                  <p className="text-text-main dark:text-slate-100">
                    {profile?.first_name && profile?.last_name
                      ? `${profile.first_name} ${profile.last_name}`
                      : 'Not provided'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-muted dark:text-slate-400 mb-1">Email</label>
                  <p className="text-text-main dark:text-slate-100">{profile?.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-muted dark:text-slate-400 mb-1">Phone</label>
                  <p className="text-text-main dark:text-slate-100">{profile?.phone ?? 'Not provided'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-muted dark:text-slate-400 mb-1">Location</label>
                  <p className="text-text-main dark:text-slate-100">
                    {profile?.city && profile?.country ? `${profile.city}, ${profile.country}` : 'Not provided'}
                  </p>
                </div>
              </div>

              {profile?.bio && (
                <div>
                  <label className="block text-sm font-medium text-text-muted dark:text-slate-400 mb-1">Bio</label>
                  <p className="text-text-main dark:text-slate-100">{profile.bio}</p>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-text-main dark:text-slate-100 mb-4">
                  Professional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-muted dark:text-slate-400 mb-1">
                      Profession
                    </label>
                    <p className="text-text-main dark:text-slate-100">{profile?.profession ?? 'Not provided'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-muted dark:text-slate-400 mb-1">
                      Experience
                    </label>
                    <p className="text-text-main dark:text-slate-100">
                      {profile?.experience_years ? `${profile.experience_years} years` : 'Not provided'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-muted dark:text-slate-400 mb-1">Skills</label>
                    <p className="text-text-main dark:text-slate-100">{profile?.skills ?? 'Not provided'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-muted dark:text-slate-400 mb-1">
                      Preferred Currency
                    </label>
                    <p className="text-text-main dark:text-slate-100">{profile?.preferred_currency ?? 'EGP'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-muted dark:text-slate-400 mb-1">
                      Hourly Rate Preference
                    </label>
                    <p className="text-text-main dark:text-slate-100">
                      {profile?.hourly_rate_preference
                        ? `${profile.hourly_rate_preference} ${profile.preferred_currency ?? 'EGP'}/hour`
                        : 'Not set'}
                    </p>
                  </div>
                </div>
              </div>

              {(profile?.portfolio_url ?? profile?.linkedin_url) && (
                <div>
                  <h3 className="text-lg font-semibold text-text-main dark:text-slate-100 mb-4">Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profile?.portfolio_url && (
                      <div>
                        <label className="block text-sm font-medium text-text-muted dark:text-slate-400 mb-1">
                          Portfolio
                        </label>
                        <a
                          href={profile.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:text-accent-dark"
                        >
                          {profile.portfolio_url}
                        </a>
                      </div>
                    )}

                    {profile?.linkedin_url && (
                      <div>
                        <label className="block text-sm font-medium text-text-muted dark:text-slate-400 mb-1">
                          LinkedIn
                        </label>
                        <a
                          href={profile.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:text-accent-dark"
                        >
                          {profile.linkedin_url}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardBodyComponent>
      </CardComponent>
    </div>
  );
}
