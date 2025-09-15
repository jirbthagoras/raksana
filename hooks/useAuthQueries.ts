import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '../types/auth';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  token: () => [...authKeys.all, 'token'] as const,
};

// Hook to get current auth token
export function useAuthToken() {
  return useQuery({
    queryKey: authKeys.token(),
    queryFn: () => apiService.getAuthToken(),
    staleTime: Infinity,
  });
}

// Hook to get user profile
export function useProfile() {
  const { data: token } = useAuthToken();
  
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => apiService.getProfile(),
    enabled: !!token, // Only fetch if we have a token
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors
      if (error?.status === 401 || error?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

// Login mutation
export function useLoginMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      const response = await apiService.login(credentials.email, credentials.password);
      // Save token after successful login
      await apiService.saveAuthToken(response.token);
      return response;
    },
    onSuccess: (data) => {
      // Update token cache
      queryClient.setQueryData(authKeys.token(), data.token);
      // Update profile cache
      queryClient.setQueryData(authKeys.profile(), data.user);
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
    onError: () => {
      // Clear any cached auth data on login failure
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
}

// Register mutation
export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const response = await apiService.register(credentials);
      return { success: true, message: 'Registrasi berhasil! Silakan login dengan akun Anda.' };
    },
  });
}

// Logout mutation
export function useLogoutMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      await apiService.logout();
    },
    onSettled: () => {
      // Clear all auth-related cache on logout (success or failure)
      queryClient.removeQueries({ queryKey: authKeys.all });
      // Clear all other cached data as well since user is logging out
      queryClient.clear();
    },
  });
}

// Hook to check authentication status
export function useAuthStatus() {
  const { data: token, isLoading: tokenLoading } = useAuthToken();
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile();
  
  const isLoading = tokenLoading || (!!token && profileLoading);
  const isAuthenticated = !!token && !!profile && !profileError;
  
  return {
    isAuthenticated,
    isLoading,
    user: profile || null,
    token: token || null,
    hasToken: !!token,
    profileError,
  };
}
