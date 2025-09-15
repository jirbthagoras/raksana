import { useAuth as useAuthContext } from '../contexts/AuthContext';
import { useAuthStatus, useLoginMutation, useRegisterMutation, useLogoutMutation } from './useAuthQueries';

// Re-export for convenience - now with additional query-based functionality
export const useAuth = useAuthContext;

// Additional query-based auth hooks for direct use
export const useAuthQuery = useAuthStatus;
export const useLogin = useLoginMutation;
export const useRegister = useRegisterMutation;
export const useLogout = useLogoutMutation;