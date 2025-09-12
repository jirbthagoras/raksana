import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import { apiService } from '../services/api';
import { AuthState, LoginCredentials, RegisterCredentials, User } from '../types/auth';

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
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; message: string; }>;
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
        // Token exists, fetch user profile from API
        try {
          const user = await apiService.getProfile();
          dispatch({ 
            type: 'RESTORE_SESSION', 
            payload: { user, token } 
          });
        } catch (profileError) {
          console.warn('Failed to fetch user profile:', profileError);
          // Token might be invalid, clear it
          await apiService.clearAuthTokens();
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.warn('Failed to restore auth state:', error);
      // Clear invalid tokens
      await apiService.clearAuthTokens();
      dispatch({ type: 'LOGOUT' });
      // Don't show error popup for auth state check failures
    }
  };

  // Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('AuthContext: Setting loading to true');
      dispatch({ type: 'SET_LOADING', payload: true });
      
      console.log('AuthContext: Calling API login');
      const response = await apiService.login(credentials.email, credentials.password);
      
      console.log('AuthContext: API response:', response);
      console.log('AuthContext: User data:', response.user);
      console.log('AuthContext: Token:', response.token);
      
      // Save token securely
      await apiService.saveAuthToken(response.token);
      
      console.log('AuthContext: Login successful, dispatching LOGIN_SUCCESS');
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user: response.user, token: response.token } 
      });
    } catch (error) {
      console.log('AuthContext: Login failed, setting loading to false, NOT changing auth state');
      // Only set loading to false, don't change authentication state
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error; // Re-throw to handle in UI
    }
  };

  // Register function
  const register = async (credentials: RegisterCredentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const { ...registerData } = credentials;
      await apiService.register(registerData);
      
      // Registration successful, but don't auto-login
      dispatch({ type: 'SET_LOADING', payload: false });
      
      // Return success message for UI to handle
      return { success: true, message: 'Registrasi berhasil! Silakan login dengan akun Anda.' };
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
