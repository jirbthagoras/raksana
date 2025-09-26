import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Task {
  id: number;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface TaskCheckboxProps {
  task: Task;
  index: number;
  onToggle: (taskId: number, completed: boolean) => void;
}

export default function TaskCheckbox({ task, index, onToggle }: TaskCheckboxProps) {
  const getDifficultyColor = () => {
    switch (task.difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return Colors.primary;
    }
  };

  const getDifficultyIcon = () => {
    switch (task.difficulty) {
      case 'easy': return 'leaf';
      case 'medium': return 'fire';
      case 'hard': return 'mountain';
      default: return 'circle';
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{
        type: 'timing',
        duration: 500,
        delay: index * 100,
      }}
      style={styles.container}
    >
      <TouchableOpacity
        style={[styles.touchable, task.completed && styles.disabledTouchable]}
        onPress={() => onToggle(task.id, !task.completed)}
        activeOpacity={task.completed ? 1 : 0.7}
        disabled={task.completed}
      >
        <View style={styles.content}>
          {/* Checkbox */}
          <MotiView
            animate={{
              backgroundColor: task.completed ? Colors.primary : 'transparent',
              borderColor: task.completed ? Colors.primary : Colors.outline,
            }}
            transition={{
              type: 'timing',
              duration: 200,
            }}
            style={styles.checkbox}
          >
            {task.completed && (
              <MotiView
                from={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  damping: 15,
                  stiffness: 150,
                }}
              >
                <FontAwesome5 name="check" size={12} color="white" />
              </MotiView>
            )}
          </MotiView>

          {/* Task Info */}
          <View style={styles.taskInfo}>
            <View style={styles.taskHeader}>
              <Text 
                style={[
                  styles.taskName,
                  task.completed && styles.completedText
                ]}
                numberOfLines={2}
              >
                {task.name}
              </Text>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor() + '20' }]}>
                <FontAwesome5 
                  name={getDifficultyIcon()} 
                  size={10} 
                  color={getDifficultyColor()} 
                />
                <Text style={[styles.difficultyText, { color: getDifficultyColor() }]}>
                  {task.difficulty}
                </Text>
              </View>
            </View>
            
            <Text 
              style={[
                styles.taskDescription,
                task.completed && styles.completedText
              ]}
            >
              {task.description}
            </Text>
          </View>
        </View>

        {/* Completion overlay */}
        {task.completed && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{
              type: 'timing',
              duration: 200,
            }}
            style={styles.completedOverlay}
          />
        )}
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: Colors.mainBackground,
    borderWidth: 1,
    borderColor: Colors.outline + '30',
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  touchable: {
    position: 'relative',
  },
  disabledTouchable: {
    opacity: 0.7,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  taskInfo: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 8,
  },
  taskName: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.onSurface,
    lineHeight: 18,
    flex: 1,
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  difficultyText: {
    fontFamily: Fonts.text.bold,
    fontSize: 10,
    textTransform: 'capitalize',
  },
  taskDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    lineHeight: 16,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  completedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.primary,
  },
});
