import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { ApiError, LeaderboardResponse, PacketsResponse, RegionsResponse, Task, TaskCompletionResponse, TasksResponse } from '../types/auth';
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
      if ((data.leveled_up || data.packet_completed)) {
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
};
