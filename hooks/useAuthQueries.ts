import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '../types/auth';
import { useEffect, useState } from 'react';

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
    onSuccess: async (data) => {
      // Update token cache
      queryClient.setQueryData(authKeys.token(), data.token);
      // Update profile cache
      queryClient.setQueryData(authKeys.profile(), data.user);
      // Cache auth state in AsyncStorage for fast startup
      await AsyncStorage.setItem('auth_state', JSON.stringify({
        isAuthenticated: true,
        user: data.user,
        timestamp: Date.now()
      }));
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
    onSettled: async () => {
      // Clear all auth-related cache on logout (success or failure)
      queryClient.removeQueries({ queryKey: authKeys.all });
      // Clear AsyncStorage auth state
      await AsyncStorage.removeItem('auth_state');
      // Clear all other cached data as well since user is logging out
      queryClient.clear();
    },
  });
}

// Fast initial auth check using AsyncStorage
export function useFastAuthCheck() {
  const [initialAuthState, setInitialAuthState] = useState<{
    isAuthenticated: boolean;
    isLoading: boolean;
    hasChecked: boolean;
  }>({ isAuthenticated: false, isLoading: true, hasChecked: false });

  useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        // Check for cached auth state in AsyncStorage (much faster than SecureStore)
        const cachedAuthState = await AsyncStorage.getItem('auth_state');
        const hasToken = await apiService.getAuthToken();
        
        if (cachedAuthState && hasToken) {
          const authData = JSON.parse(cachedAuthState);
          // If we have both cached state and token, assume authenticated for fast navigation
          setInitialAuthState({ 
            isAuthenticated: true, 
            isLoading: false, 
            hasChecked: true 
          });
        } else {
          setInitialAuthState({ 
            isAuthenticated: false, 
            isLoading: false, 
            hasChecked: true 
          });
        }
      } catch (error) {
        setInitialAuthState({ 
          isAuthenticated: false, 
          isLoading: false, 
          hasChecked: true 
        });
      }
    };

    checkInitialAuth();
  }, []);

  return initialAuthState;
}

// Hook to check authentication status (optimized for fast startup)
export function useAuthStatus() {
  const { data: token, isLoading: tokenLoading } = useAuthToken();
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile();
  const fastAuth = useFastAuthCheck();
  
  // Use fast auth check for initial state, then switch to full validation
  const isLoading = !fastAuth.hasChecked || (fastAuth.hasChecked && tokenLoading) || (!!token && profileLoading);
  const isAuthenticated = fastAuth.hasChecked && !tokenLoading ? 
    (!!token && (!!profile || profileLoading)) : // If token exists and profile is loading or loaded
    fastAuth.isAuthenticated; // Use fast check for immediate feedback
  
  return {
    isAuthenticated,
    isLoading,
    user: profile || null,
    token: token || null,
    hasToken: !!token,
    profileError,
    isFastAuthComplete: fastAuth.hasChecked,
  };
}
