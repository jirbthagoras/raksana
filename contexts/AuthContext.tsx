import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, User, LoginCredentials, RegisterCredentials, ApiError } from '../types/auth';
import { apiService } from '../services/api';
import * as SecureStore from 'expo-secure-store';

// Auth Actions
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'RESTORE_SESSION'; payload: { user: User; token: string } };

// Auth Context Type
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  checkAuthState: () => Promise<void>;
}

// Initial State
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

// Auth Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'RESTORE_SESSION':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    default:
      return state;
  }
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is already authenticated on app start
  const checkAuthState = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const token = await apiService.getAuthToken();
      if (token) {
        // Verify token by getting user profile
        const user = await apiService.getProfile();
        dispatch({ 
          type: 'RESTORE_SESSION', 
          payload: { user, token } 
        });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.warn('Failed to restore auth session:', error);
      // Clear invalid tokens
      await apiService.clearAuthTokens();
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await apiService.login(credentials.email, credentials.password);
      
      // Save token securely
      await apiService.saveAuthToken(response.token);
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user: response.user, token: response.token } 
      });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error; // Re-throw to handle in UI
    }
  };

  // Register function
  const register = async (credentials: RegisterCredentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const { confirmPassword, ...registerData } = credentials;
      const response = await apiService.register(registerData);
      
      // Save token securely
      await apiService.saveAuthToken(response.token);
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user: response.user, token: response.token } 
      });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error; // Re-throw to handle in UI
    }
  };

  // Logout function
  const logout = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await apiService.logout();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.warn('Logout failed:', error);
      // Force logout even if API call fails
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Update user function
  const updateUser = (user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  // Check auth state on mount
  useEffect(() => {
    checkAuthState();
  }, []);

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    checkAuthState,
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
