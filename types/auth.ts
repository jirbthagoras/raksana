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
  data: {
    regions: Region[];
  };
}

// Leaderboard types
export interface LeaderboardEntry {
  id: string;
  name: string;
  image_url: string;
  points: number;
  rank: number;
  is_user: boolean;
}

export interface LeaderboardResponse {
  data: {
    leaderboard: LeaderboardEntry[];
  };
}

// Recap types
export interface WeeklyRecap {
  summary: string;
  tips: string;
  assigned_task: number;
  completed_task: number;
  completion_rate: string;
  growth_rating: string;
  created_at: string;
}

export interface WeeklyRecapData {
  assigned_tasks: number;
  completed_tasks: number;
  date: string;
  growth_rating: string;
  summary: string;
  task_completion_rate: string;
  tips: string;
}

export interface CreateWeeklyRecapResponse {
  data: {
    recap: WeeklyRecapData;
  };
}

export interface MonthlyRecap {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  total_memories: number;
  total_tasks_completed: number;
  total_challenges_completed: number;
  total_points_earned: number;
  created_at: string;
}

export interface WeeklyRecapResponse {
  data: {
    recaps: WeeklyRecap[];
  };
}

export interface PointHistoryItem {
  name: string;
  type: string;
  category: string;
  amount: number;
  created_at: string;
}

export interface PointHistoryResponse {
  data: {
    balance: number;
    histories: PointHistoryItem[];
  };
}

export interface MonthlyRecapResponse {
  data: {
    monthly_recaps: MonthlyRecap[];
  };
}

// Memory types
export interface Memory {
  memory_id: number;
  file_url: string;
  description: string;
  created_at: string;
  user_id: number;
  user_name: string;
  is_participation?: boolean;
  challenge_id?: number;
  day?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  challenge_name?: string;
  point_gain?: number;
}

export interface MemoriesResponse {
  data: {
    memories: Memory[];
  };
}

// Event types
export interface Event {
  id: number;
  location: string;
  latitude: number;
  longitude: number;
  contact: string;
  starts_at: string;
  ends_at: string;
  cover_url: string;
  name: string;
  description: string;
  point_gain: number;
  created_at: string;
  participated: boolean;
}

export interface EventsResponse {
  data: {
    events: Event[];
  };
}

// Challenge types
export interface Challenge {
  id: number;
  day: number;
  difficulty: string;
  name: string;
  description: string;
}

export interface ChallengesResponse {
  data: {
    challenges: Challenge[];
  };
}

export interface ChallengeParticipant {
  file_url: string;
  description: string;
  created_at: string;
  user_id: number;
  user_name: string;
}

export interface ChallengeParticipantsResponse {
  data: {
    participants: ChallengeParticipant[];
  };
}

// Activity types
export interface Activity {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  description: string;
  point_gain: number;
  type: 'contribution' | 'attendance';
}

export interface ActivityResponse {
  data: {
    activities: Activity[];
  };
}

// Recyclopedia/Trash Scan types
export interface RecyclingItem {
  id: number;
  name: string;
  description: string;
  value: 'low' | 'mid' | 'high';
  having_greenprint: boolean;
}

export interface TrashScan {
  title: string;
  description: string;
  image_key: string;
  items: RecyclingItem[];
}

export interface TrashScansResponse {
  data: {
    scans: TrashScan[];
  };
}

// Trash Scan Result (single scan response)
export interface TrashScanResult {
  title: string;
  description: string;
  image_key: string;
  items: RecyclingItem[];
}

export interface TrashScanResponse {
  data: TrashScanResult;
}
