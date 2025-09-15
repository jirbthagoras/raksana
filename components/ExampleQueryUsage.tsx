import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useDailyChallenge, useMyPackets, useTodayTasks, useUpdateTaskCompletion } from '../hooks/useApiQueries';

// Example component showing how to use the new TanStack Query hooks
export default function ExampleQueryUsage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  
  // Query hooks - these automatically handle loading, error states, and caching
  const { data: dailyChallenge, isLoading: challengeLoading, error: challengeError } = useDailyChallenge();
  const { data: packets, isLoading: packetsLoading, refetch: refetchPackets } = useMyPackets();
  const { data: tasks, isLoading: tasksLoading, refetch: refetchTasks } = useTodayTasks();
  
  // Mutation hook for updating task completion
  const updateTaskMutation = useUpdateTaskCompletion();

  const handleTaskToggle = (taskId: number, completed: boolean) => {
    updateTaskMutation.mutate({ taskId, completed });
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text>Please log in to see this content</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Welcome, {user?.name || user?.username}!</Text>
        <Button title="Logout" onPress={logout} />
      </View>

      {/* Daily Challenge Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Challenge</Text>
        {challengeLoading ? (
          <Text>Loading challenge...</Text>
        ) : challengeError ? (
          <Text style={styles.error}>Error loading challenge</Text>
        ) : (
          <Text>{JSON.stringify(dailyChallenge, null, 2)}</Text>
        )}
      </View>

      {/* Packets Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Packets</Text>
        <Button title="Refresh Packets" onPress={() => refetchPackets()} />
        {packetsLoading ? (
          <Text>Loading packets...</Text>
        ) : (
          <Text>{JSON.stringify(packets, null, 2)}</Text>
        )}
      </View>

      {/* Tasks Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Tasks</Text>
        <Button title="Refresh Tasks" onPress={() => refetchTasks()} />
        {tasksLoading ? (
          <Text>Loading tasks...</Text>
        ) : (
          <View>
            {tasks?.map((task: any) => (
              <View key={task.id} style={styles.taskItem}>
                <Text>{task.title}</Text>
                <Button
                  title={task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                  onPress={() => handleTaskToggle(task.id, !task.completed)}
                  disabled={updateTaskMutation.isPending}
                />
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Mutation Status */}
      {updateTaskMutation.isPending && (
        <Text style={styles.info}>Updating task...</Text>
      )}
      {updateTaskMutation.isError && (
        <Text style={styles.error}>Failed to update task</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    marginVertical: 4,
    backgroundColor: 'white',
    borderRadius: 4,
  },
  error: {
    color: 'red',
  },
  info: {
    color: 'blue',
  },
});
