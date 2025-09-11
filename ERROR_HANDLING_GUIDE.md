# Error Handling System Documentation

## Overview
This error handling system replaces default browser alerts with beautiful, consistent popup messages that properly handle your Go backend error structure.

## Components

### 1. ErrorPopup Component (`components/ErrorPopup.tsx`)
- Beautiful modal popup with different styles for error, warning, and info types
- Uses your app's design system (Colors, Fonts)
- Smooth animations and proper accessibility

### 2. ErrorContext (`contexts/ErrorContext.tsx`)
- Global error state management
- Provides hooks for showing/hiding errors
- Automatically determines error type based on HTTP status codes

### 3. API Service Updates (`services/api.ts`)
- Handles your Go backend error structure:
  ```json
  {
    "success": false,
    "error": {
      "message": "Error message",
      "fields": {...} // For validation errors
    }
  }
  ```
- Extracts correct error messages from `responseData.error.message`
- Supports validation errors (400 + fields), internal server errors (500), and basic errors

## Usage

### In Components
```typescript
import { useError } from '../contexts/ErrorContext';

const { showError, showApiError } = useError();

// For client-side validation
showError('Please fill all fields', 'Input Required', 'warning');

// For API errors (usually handled automatically by AuthContext)
showApiError(error);
```

### Error Types
- **error**: Red styling for critical errors
- **warning**: Orange styling for validation issues
- **info**: Blue styling for informational messages

## Backend Error Handling

Your Go backend returns errors in this format:
```go
// Basic error
{
  "success": false,
  "error": {
    "message": "Error message"
  }
}

// Validation error
{
  "success": false,
  "error": {
    "message": "Failed validation",
    "fields": {
      "email": ["Email is required"],
      "password": ["Password must be at least 8 characters"]
    }
  }
}

// Internal server error
{
  "success": false,
  "error": {
    "message": "Internal server error"
  }
}
```

The system automatically:
1. Extracts the message from `error.message`
2. Determines popup type based on HTTP status code
3. Shows appropriate styling and title

## Integration

The system is integrated at the app level:
```typescript
// app/_layout.tsx
<ErrorProvider>
  <AuthProvider>
    <AuthGuard>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthGuard>
  </AuthProvider>
</ErrorProvider>
```

## Benefits

1. **Consistent UX**: All errors show with the same beautiful popup design
2. **Automatic Handling**: API errors are handled automatically in AuthContext
3. **Type-Aware**: Different visual styles for different error types
4. **Backend Integration**: Properly extracts messages from your Go backend structure
5. **Clean Code**: Removes need for Alert.alert() calls throughout the app

## Examples

- Login/Register screens now use the new error system
- AuthContext automatically shows API errors as popups
- Client-side validation shows as warning popups
- Server errors show as error popups with appropriate styling
