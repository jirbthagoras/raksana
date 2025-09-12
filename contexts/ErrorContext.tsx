import React, { createContext, ReactNode, useContext, useState } from 'react';
import { ErrorPopup } from '../components/ErrorPopup';

interface ErrorState {
  visible: boolean;
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
}

interface ErrorContextType {
  showError: (message: string, title?: string, type?: 'error' | 'warning' | 'info') => void;
  hideError: () => void;
  showApiError: (error: any) => void;
  hasActiveError: boolean;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
}

export function ErrorProvider({ children }: ErrorProviderProps) {
  const [errorState, setErrorState] = useState<ErrorState>({
    visible: false,
    title: 'Error',
    message: '',
    type: 'error',
  });

  const showError = (message: string, title = 'Error', type: 'error' | 'warning' | 'info' = 'error') => {
    setErrorState({
      visible: true,
      title,
      message,
      type,
    });
  };

  const hideError = () => {
    setErrorState(prev => ({
      ...prev,
      visible: false,
    }));
  };

  const showApiError = (error: any) => {
    let title = 'Error';
    let type: 'error' | 'warning' | 'info' = 'error';

    // Determine title and type based on error status
    if (error.status === 500) {
      title = 'Server Error';
      type = 'error';
    } else if (error.status === 400) {
      title = 'Error';
      type = 'warning';
    } else if (error.status === 401) {
      title = 'Authentication Error';
      type = 'warning';
    } else if (error.status === 403) {
      title = 'Access Denied';
      type = 'warning';
    } else if (error.status === 404) {
      title = 'Not Found';
      type = 'warning';
    } else if (error.status === 0) {
      title = 'Connection Error';
      type = 'error';
    }

    showError(error.message || 'An unexpected error occurred', title, type);
  };

  const contextValue: ErrorContextType = {
    showError,
    hideError,
    showApiError,
    hasActiveError: errorState.visible,
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
      <ErrorPopup
        visible={errorState.visible}
        title={errorState.title}
        message={errorState.message}
        type={errorState.type}
        onClose={hideError}
      />
    </ErrorContext.Provider>
  );
}

export function useError(): ErrorContextType {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
}

export default ErrorContext;
