import { useRouter, useSegments } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useError } from '../contexts/ErrorContext';
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

  useEffect(() => {
    if (isLoading) return; // Wait for auth state to be determined
    
    // Don't do any navigation when there's an active error popup
    if (hasActiveError) {
      console.log('AuthGuard: Active error popup, skipping all navigation');
      return;
    }

    const firstSegment = segments[0];
    const isAuthRoute = firstSegment === 'login' || firstSegment === 'register';
    const isRootRoute = segments.length < 1;

    // Don't do any redirects if user is on auth routes - let them handle their own navigation
    if (isAuthRoute) {
      console.log('AuthGuard: On auth route, skipping all redirects');
      // Update the previous state to prevent future unwanted redirects
      previousAuthState.current = isAuthenticated;
      return;
    }

    // Only redirect when authentication state actually changes, not on every render
    const authStateChanged = previousAuthState.current !== null && previousAuthState.current !== isAuthenticated;
    const isFirstLoad = previousAuthState.current === null;

    console.log('AuthGuard Debug:', {
      isLoading,
      isAuthenticated,
      firstSegment,
      isAuthRoute,
      isRootRoute,
      authStateChanged,
      isFirstLoad,
      previousAuthState: previousAuthState.current
    });

    if (isFirstLoad) {
      // Initial load logic
      previousAuthState.current = isAuthenticated;
      
      if (isAuthenticated) {
        if (isRootRoute) {
          console.log('AuthGuard: Redirecting authenticated user from root to tabs');
          router.replace('/(tabs)');
        }
      } else {
        if (!isRootRoute) {
          console.log('AuthGuard: Redirecting unauthenticated user to login');
          router.replace('/login');
        }
      }
    } else if (authStateChanged) {
      // Only redirect when auth state actually changes
      previousAuthState.current = isAuthenticated;
      
      if (isAuthenticated) {
        // User just logged in successfully
        console.log('AuthGuard: User authenticated, redirecting to tabs');
        router.replace('/(tabs)');
      }
      // Don't redirect when user becomes unauthenticated - let them stay where they are
    }
  }, [isAuthenticated, isLoading, segments, hasActiveError]);

  // Show loading screen while checking auth state
  return (
    <View style={{ flex: 1, position: 'relative' }}>
      {children}
      <LoadingOverlay visible={isLoading} />
    </View>
  );
}
