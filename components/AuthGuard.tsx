import { useRouter, useSegments } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useError } from '../contexts/ErrorContext';
import { useAuth } from '../hooks/useAuth';
import LoadingOverlay from './LoadingComponent';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasActiveError } = useError();
  const router = useRouter();
  const segments = useSegments();
  const previousAuthState = useRef<boolean | null>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (isLoading) {
      return; // Wait for auth state to be determined
    }
    
    // Don't do any navigation when there's an active error popup
    if (hasActiveError) {
      return;
    }

    const firstSegment = segments[0];
    const isAuthRoute = firstSegment === 'login' || firstSegment === 'register';
    const isRootRoute = segments.length < 1;
    const isTabsRoute = firstSegment === '(tabs)';

    // Update previous state to track changes
    const authStateChanged = previousAuthState.current !== null && previousAuthState.current !== isAuthenticated;
    previousAuthState.current = isAuthenticated;

    // Handle authenticated users
    if (isAuthenticated) {
      // If user is authenticated but on login/register page, redirect to tabs
      if (isAuthRoute) {
        router.replace('/(tabs)');
        return;
      }
      // If user is authenticated but on root, redirect to tabs
      if (isRootRoute) {
        router.replace('/(tabs)');
        return;
      }
    } else {
      // Handle unauthenticated users
      // If user is not authenticated and not on auth routes or root, redirect to login
      if (!isAuthRoute && !isRootRoute) {
        router.replace('/login');
        return;
      }
    }
  }, [isAuthenticated, isLoading, segments, hasActiveError, router]);

  // Show loading screen while checking auth state
  return (
    <View style={{ flex: 1, position: 'relative' }}>
      {children}
      <LoadingOverlay visible={isLoading} />
    </View>
  );
}
