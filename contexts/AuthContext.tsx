import React, { createContext, ReactNode, useContext } from 'react';
import { AuthState, LoginCredentials, RegisterCredentials, User } from '../types/auth';
import { 
  useAuthStatus, 
  useLoginMutation, 
  useRegisterMutation, 
  useLogoutMutation 
} from '../hooks/useAuthQueries';
import { useQueryClient } from '@tanstack/react-query';
import { authKeys } from '../hooks/useAuthQueries';

// Auth Context Type - now powered by TanStack Query
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; message: string; }>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  checkAuthState: () => Promise<void>;
  // Additional query states
  isLoginLoading: boolean;
  isRegisterLoading: boolean;
  isLogoutLoading: boolean;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();
  
  // Use TanStack Query hooks for auth state
  const authStatus = useAuthStatus();
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();

  // Login function using mutation
  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('AuthContext: Starting login process');
      await loginMutation.mutateAsync(credentials);
      console.log('AuthContext: Login successful');
    } catch (error) {
      console.log('AuthContext: Login failed');
      throw error; // Re-throw to handle in UI
    }
  };

  // Register function using mutation
  const register = async (credentials: RegisterCredentials) => {
    try {
      const result = await registerMutation.mutateAsync(credentials);
      return result;
    } catch (error) {
      throw error; // Re-throw to handle in UI
    }
  };

  // Logout function using mutation
  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.warn('Logout failed:', error);
      // Force logout even if API call fails - mutation handles cache clearing
    }
  };

  // Update user function - updates query cache
  const updateUser = (user: User) => {
    queryClient.setQueryData(authKeys.profile(), user);
  };

  // Check auth state - this is handled automatically by queries now
  const checkAuthState = async () => {
    // With TanStack Query, this is handled automatically by the useAuthStatus hook
    // We can manually refetch if needed
    await queryClient.refetchQueries({ queryKey: authKeys.all });
  };

  const contextValue: AuthContextType = {
    // Auth state from queries
    user: authStatus.user,
    token: authStatus.token,
    isLoading: authStatus.isLoading,
    isAuthenticated: authStatus.isAuthenticated,
    
    // Auth functions
    login,
    register,
    logout,
    updateUser,
    checkAuthState,
    
    // Mutation loading states
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
