import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import { useError } from '../contexts/ErrorContext';

// Example component showing how to use the error handling system
export function ErrorHandlingExample() {
  const { showError, showApiError } = useError();

  const simulateBasicError = () => {
    showError('This is a basic error message', 'Basic Error', 'error');
  };

  const simulateWarning = () => {
    showError('This is a warning message', 'Warning', 'warning');
  };

  const simulateInfo = () => {
    showError('This is an info message', 'Information', 'info');
  };

  const simulateApiError = () => {
    // Simulate your backend error structure
    const mockApiError = {
      message: 'Internal server error occurred',
      status: 500,
    };
    showApiError(mockApiError);
  };

  const simulateValidationError = () => {
    // Simulate validation error from your backend
    const mockValidationError = {
      message: 'Failed validation',
      status: 400,
      errors: {
        email: ['Email is required'],
        password: ['Password must be at least 8 characters'],
      },
    };
    showApiError(mockValidationError);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Error Handling Examples</Text>
      
      <TouchableOpacity style={styles.button} onPress={simulateBasicError}>
        <Text style={styles.buttonText}>Show Basic Error</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.warningButton]} onPress={simulateWarning}>
        <Text style={styles.buttonText}>Show Warning</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.infoButton]} onPress={simulateInfo}>
        <Text style={styles.buttonText}>Show Info</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.apiButton]} onPress={simulateApiError}>
        <Text style={styles.buttonText}>Simulate API Error (500)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.validationButton]} onPress={simulateValidationError}>
        <Text style={styles.buttonText}>Simulate Validation Error (400)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.text.bold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  warningButton: {
    backgroundColor: '#FF9500',
  },
  infoButton: {
    backgroundColor: '#007AFF',
  },
  apiButton: {
    backgroundColor: '#FF3B30',
  },
  validationButton: {
    backgroundColor: '#FF6B35',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: Fonts.text.bold,
    color: Colors.primary,
  },
});
