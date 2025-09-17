export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  token?: string;
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

// Task and Packet types
export interface Task {
  id: number;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Packet {
  id: number;
  name: string;
  target: string;
  description: string;
  completed_task: number;
  expected_task: number;
  assigned_task: number;
  completion_rate: string;
  task_per_day: number;
  completed: boolean;
  created_at: string;
}

export interface TasksResponse {
  tasks: Task[];
  message?: string;
}

export interface PacketsResponse {
  packets: Packet[];
}

export interface TaskCompletionResponse {
  current_level: number;
  leveled_up: boolean;
  message: string;
  packet_completed: boolean;
  packet_name: string;
  unlock?: {
    packet_name: string;
    difficulty: string;
    is_unlocked: boolean;
  };
}

// Region types
export interface Region {
  id: number;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  tree_amount: number;
}

export interface RegionsResponse {
  regions: Region[];
}
