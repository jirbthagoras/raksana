export interface User {
  id: number;
  email: string;
  username: string;
  name?: string;
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
  password_confirmation: string;
}

// Go API response format
export interface GoApiResponse<T> {
  data: T;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  message: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
