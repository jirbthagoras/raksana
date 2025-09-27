import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { ApiError, CreateWeeklyRecapResponse, EventsResponse, LeaderboardResponse, MemoriesResponse, MonthlyRecapResponse, PacketsResponse, PointHistoryResponse, RegionsResponse, Task, TaskCompletionResponse, TasksResponse, WeeklyRecapResponse } from '../types/auth';
import { useAuthStatus } from './useAuthQueries';

// Query keys for different API endpoints
export const apiKeys = {
  profile: () => ['profile'] as const,
  dailyChallenge: () => ['dailyChallenge'] as const,
  packets: () => ['packets'] as const,
  tasks: () => ['tasks'] as const,
  task: (id: number) => ['task', id] as const,
  packetDetail: (id: number) => ['packetDetail', id] as const,
  regions: () => ['regions'] as const,
  logs: () => ['logs'] as const,
  leaderboard: () => ['leaderboard'] as const,
  weeklyRecaps: () => ['weeklyRecaps'] as const,
  monthlyRecaps: () => ['monthlyRecaps'] as const,
  memories: () => ['memories'] as const,
  pointHistory: () => ['pointHistory'] as const,
  events: () => ['events'] as const,
};

// Profile queries
export function useProfileMe() {
  const { isAuthenticated } = useAuthStatus();
  
  return useQuery({
    queryKey: apiKeys.profile(),
    queryFn: () => apiService.getProfileMe(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Daily Challenge Query
export const useDailyChallenge = () => {
  return useQuery({
    queryKey: ['dailyChallenge'],
    queryFn: () => apiService.getDailyChallenge(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiService.getUsers(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Today's Tasks Query
export const useTodayTasks = () => {
  const { isAuthenticated } = useAuthStatus();
  
  return useQuery<TasksResponse, ApiError>({
    queryKey: ['tasks', 'today'],
    queryFn: () => apiService.getTodayTasks(),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: ApiError) => {
      // Don't retry on 409 (no active packet)
      if (error?.status === 409) return false;
      return failureCount < 3;
    },
  });
};

// My Packets Query
export const useMyPackets = () => {
  const { isAuthenticated } = useAuthStatus();
  
  return useQuery<PacketsResponse, ApiError>({
    queryKey: ['packets', 'me'],
    queryFn: () => apiService.getMyPackets(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Task Completion Mutation with Congratulation Handling
export const useUpdateTaskCompletion = (onCongratulation?: (response: TaskCompletionResponse) => void) => {
  const queryClient = useQueryClient();
  
  return useMutation<TaskCompletionResponse, ApiError, { taskId: number; completed: boolean }, { previousTasks: any }>({
    mutationFn: ({ taskId, completed }: { taskId: number; completed: boolean }) => 
      apiService.updateTaskCompletion(taskId, completed),
    onMutate: async ({ taskId, completed }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks', 'today'] });
      
      // Snapshot previous value
      const previousTasks = queryClient.getQueryData(['tasks', 'today']);
      
      // Optimistically update
      queryClient.setQueryData(['tasks', 'today'], (old: any) => {
        if (!old?.tasks) return old;
        return {
          ...old,
          tasks: old.tasks.map((task: Task) => 
            task.id === taskId ? { ...task, completed } : task
          )
        };
      });
      
      return { previousTasks };
    },
    onSuccess: (data) => {
      // Handle congratulation popups
      console.log(data)
      if ((data.leveled_up || data.packet_completed || (data.unlock && data.unlock.is_unlocked))) {
        onCongratulation?.(data);
      }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks', 'today'], context.previousTasks);
      }
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['tasks', 'today'] });
      queryClient.invalidateQueries({ queryKey: ['packets', 'me'] });
      // Invalidate all packet detail queries to sync completion percentages
      queryClient.invalidateQueries({ queryKey: ['packetDetail'] });
      // Invalidate profile data to update homepage level, exp, and points
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

// Packet Detail Query
export const usePacketDetail = (packetId: number) => {
  const { isAuthenticated } = useAuthStatus();
  
  return useQuery({
    queryKey: apiKeys.packetDetail(packetId),
    queryFn: () => apiService.getPacketDetail(packetId),
    enabled: isAuthenticated && packetId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Regions Query
export const useRegions = () => {
  const { isAuthenticated } = useAuthStatus();
  
  return useQuery<RegionsResponse, ApiError>({
    queryKey: apiKeys.regions(),
    queryFn: () => apiService.getRegions(),
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Create Packet Mutation
export const useCreatePacket = () => {
  const queryClient = useQueryClient();
  
  return useMutation<any, ApiError, { target: string; description: string }>({
    mutationFn: ({ target, description }) => 
      apiService.createPacket({ target, description }),
    onSuccess: () => {
      // Invalidate and refetch packets list
      queryClient.invalidateQueries({ queryKey: ['packets', 'me'] });
      // Also invalidate tasks in case the new packet becomes active
      queryClient.invalidateQueries({ queryKey: ['tasks', 'today'] });
    },
  });
};

// Logs Query
export const useLogs = (isPrivate: boolean = false) => {
  const { isAuthenticated } = useAuthStatus();
  
  return useQuery({
    queryKey: [...apiKeys.logs(), isPrivate],
    queryFn: () => apiService.getLogs(isPrivate),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create Log Mutation
export const useCreateLog = () => {
  const queryClient = useQueryClient();
  
  return useMutation<any, ApiError, { text: string; is_private: boolean }>({
    mutationFn: ({ text, is_private }) => 
      apiService.createLog({ text, is_private }),
    onSuccess: () => {
      // Invalidate and refetch logs list
      queryClient.invalidateQueries({ queryKey: apiKeys.logs() });
    },
  });
};

// Leaderboard Query
export const useLeaderboard = () => {
  const { isAuthenticated } = useAuthStatus();
  
  return useQuery<LeaderboardResponse, ApiError>({
    queryKey: apiKeys.leaderboard(),
    queryFn: () => apiService.getLeaderboard(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Weekly Recaps Query
export const useWeeklyRecaps = () => {
  const { isAuthenticated } = useAuthStatus();
  
  return useQuery<WeeklyRecapResponse, ApiError>({
    queryKey: apiKeys.weeklyRecaps(),
    queryFn: () => apiService.getWeeklyRecaps(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Create Weekly Recap Mutation
export const useCreateWeeklyRecap = () => {
  return useMutation<CreateWeeklyRecapResponse, ApiError, void>({
    mutationFn: () => apiService.createWeeklyRecap(),
  });
};

// Create Monthly Recap Mutation
export const useCreateMonthlyRecap = () => {
  return useMutation<any, ApiError, void>({
    mutationFn: () => apiService.createMonthlyRecap(),
  });
};

// Monthly Recaps Query
export const useMonthlyRecaps = () => {
  const { isAuthenticated } = useAuthStatus();
  
  return useQuery<MonthlyRecapResponse, ApiError>({
    queryKey: apiKeys.monthlyRecaps(),
    queryFn: () => apiService.getMonthlyRecaps(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Memories Query
export const useMemories = () => {
  const { isAuthenticated } = useAuthStatus();
  
  return useQuery<MemoriesResponse, ApiError>({
    queryKey: apiKeys.memories(),
    queryFn: () => apiService.getMemories(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Create Memory Mutation
export const useCreateMemory = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ data: { presigned_url: string } }, ApiError, { content_type: string; filename: string; description: string }>({
    mutationFn: (data) => apiService.createMemory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.memories() });
    },
  });
};

// Delete Memory Mutation
export const useDeleteMemory = () => {
  const queryClient = useQueryClient();
  
  return useMutation<any, ApiError, number>({
    mutationFn: (memoryId) => apiService.deleteMemory(memoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.memories() });
    },
  });
};

// Point History Query
export const usePointHistory = () => {
  const { isAuthenticated } = useAuthStatus();
  
  return useQuery<PointHistoryResponse, ApiError>({
    queryKey: apiKeys.pointHistory(),
    queryFn: () => apiService.getPointHistory(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Challenge Participation Mutation
export const useChallengeParticipation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ data: { presigned_url: string } }, ApiError, { challenge_id: number; description: string; filename: string; content_type: string }>({
    mutationFn: (data: { challenge_id: number; description: string; filename: string; content_type: string }) => 
      apiService.participateInChallenge(data),
    onSuccess: () => {
      // Invalidate and refetch memories, daily challenge, and recaps data
      queryClient.invalidateQueries({ queryKey: ['memories'] });
      queryClient.invalidateQueries({ queryKey: ['dailyChallenge'] });
      queryClient.invalidateQueries({ queryKey: ['weeklyRecaps'] });
      queryClient.invalidateQueries({ queryKey: ['monthlyRecaps'] });
    },
  });
};

// Events Query
export const useEvents = () => {
  const { isAuthenticated } = useAuthStatus();
  
  return useQuery<EventsResponse, ApiError>({
    queryKey: apiKeys.events(),
    queryFn: () => apiService.getEvents(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Export all hooks for easy access
export const apiQueries = {
  useDailyChallenge,
  useTodayTasks,
  useMyPackets,
  useUpdateTaskCompletion,
  usePacketDetail,
  useRegions,
  useLogs,
  useCreateLog,
  useLeaderboard,
  useWeeklyRecaps,
  useMonthlyRecaps,
  usePointHistory,
};
