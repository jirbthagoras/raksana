import { useRouter, useSegments } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '../constants';
import { useAuth } from '../contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const previousAuthState = useRef<boolean | null>(null);

  useEffect(() => {
    if (isLoading) return; // Wait for auth state to be determined

    const firstSegment = segments[0];
    const isAuthRoute = firstSegment === 'login' || firstSegment === 'register';
    const isRootRoute = segments.length < 1;

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
        if (isAuthRoute || isRootRoute) {
          console.log('AuthGuard: Redirecting authenticated user from auth route to home');
          router.replace('/home');
        }
      } else {
        if (!isAuthRoute && !isRootRoute) {
          console.log('AuthGuard: Redirecting unauthenticated user to login');
          router.replace('/login');
        }
      }
    } else if (authStateChanged) {
      // Only redirect when auth state actually changes
      previousAuthState.current = isAuthenticated;
      
      if (isAuthenticated) {
        // User just logged in successfully
        console.log('AuthGuard: User authenticated, redirecting to home');
        router.replace('/home');
      }
      // Don't redirect when user becomes unauthenticated - let them stay where they are
    }
  }, [isAuthenticated, isLoading, segments]);

  // Show loading screen while checking auth state
  if (isLoading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
      }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
}
