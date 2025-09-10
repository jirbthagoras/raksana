import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { AuthResponse, ApiError } from '../types/auth';

// API Configuration
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' // Development
  : 'https://your-production-api.com/api'; // Production

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Add auth token
    this.api.interceptors.request.use(
      async (config) => {
        try {
          const token = await SecureStore.getItemAsync('auth_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.warn('Failed to get auth token:', error);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Handle errors
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        // Handle 401 Unauthorized - just clear token and logout
        if (error.response?.status === 401) {
          await this.clearAuthTokens();
          // You can emit an event here to redirect to login
        }

        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  private handleApiError(error: AxiosError): ApiError {
    if (error.response) {
      const responseData = error.response.data as any;
      return {
        message: responseData?.message || 'An error occurred',
        status: error.response.status,
        errors: responseData?.errors,
      };
    } else if (error.request) {
      return {
        message: 'Network error. Please check your connection.',
        status: 0,
      };
    } else {
      return {
        message: error.message || 'An unexpected error occurred',
        status: -1,
      };
    }
  }

  // Auth methods
  async login(email: string, password: string): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  async register(userData: {
    email: string;
    username: string;
    name: string;
    password: string;
  }): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async logout(): Promise<void> {
    await this.clearAuthTokens();
  }

  async getProfile(): Promise<any> {
    const response = await this.api.get('/auth/profile');
    return response.data;
  }

  // Token management
  async saveAuthToken(token: string): Promise<void> {
    await SecureStore.setItemAsync('auth_token', token);
  }

  async clearAuthTokens(): Promise<void> {
    await SecureStore.deleteItemAsync('auth_token');
  }

  async getAuthToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('auth_token');
  }

  // Generic API methods
  async get<T>(endpoint: string): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(endpoint);
    return response.data;
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(endpoint, data);
    return response.data;
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(endpoint, data);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(endpoint);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
