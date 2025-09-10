export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
