import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, handleApiError } from '@/lib/api';
import { UserProfile } from '@/types/api';

export function useUserProfile() {
  const queryClient = useQueryClient();

  // Fetch user profile
  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => apiClient.getUserProfile(),
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

  // Update user profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<UserProfile>) => apiClient.updateUserProfile(data),
    onSuccess: updatedProfile => {
      // Update the cache with the new profile data
      queryClient.setQueryData(['userProfile'], updatedProfile);

      // Invalidate related queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: error => {
      console.error('Profile update failed:', handleApiError(error));
    },
  });

  const updateProfile = (data: Partial<UserProfile>) => {
    return updateProfileMutation.mutateAsync(data);
  };

  return {
    profile,
    isLoading,
    error: error ? handleApiError(error) : null,
    updateProfile,
    updateProfileLoading: updateProfileMutation.isPending,
    updateProfileError: updateProfileMutation.error ? handleApiError(updateProfileMutation.error) : null,
    refetch,
  };
}
