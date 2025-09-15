import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { Task, Packet, TasksResponse, PacketsResponse, GoApiResponse, ApiError } from '../types/auth';
import { useAuthStatus } from './useAuthQueries';

// Query keys for different API endpoints
export const apiKeys = {
  profile: () => ['profile'] as const,
  dailyChallenge: () => ['dailyChallenge'] as const,
  packets: () => ['packets'] as const,
  tasks: () => ['tasks'] as const,
  task: (id: number) => ['task', id] as const,
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

// Task Completion Mutation
export const useUpdateTaskCompletion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
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
    },
  });
};

// Export all hooks for easy access
export const apiQueries = {
  useDailyChallenge,
  useTodayTasks,
  useMyPackets,
  useUpdateTaskCompletion,
};
