import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ApiError, AuthResponse, GoApiResponse, RegisterResponse } from '../types/auth';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL

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
            config.headers.Authorization = `${token}`;
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
        if (error.response?.status === 401) {
          await this.clearAuthTokens();
        }

        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  private handleApiError(error: AxiosError): ApiError {
    if (error.response) {
      const responseData = error.response.data as any;
      
      // Handle your Go backend error structure
      if (responseData && !responseData.success && responseData.error) {
        const backendError = responseData.error;
        
        // Extract message from backend error structure
        let message = backendError.message || 'Terjadi kesalahan';
        
        // Handle different error types based on your Go backend
        if (error.response.status === 400 && backendError.fields) {
          // Validation error - has fields
          message = backendError.message || 'Failed validation';
        } else if (error.response.status === 500) {
          // Internal server error
          message = backendError.message || 'Internal server error';
        } else {
          // Basic error
          message = backendError.message || 'Terjadi kesalahan';
        }
        
        return {
          message,
          status: error.response.status,
          errors: backendError.fields, // For validation errors
        };
      }
      
      // Fallback for non-standard responses
      let message = 'Terjadi kesalahan';
      switch (error.response.status) {
        case 400:
          message = 'Data yang dikirim tidak valid';
          break;
        case 401:
          message = 'Unauthorized';
          break;
        case 403:
          message = 'Akses ditolak';
          break;
        case 404:
          message = 'Endpoint tidak ditemukan';
          break;
        case 500:
          message = 'Terjadi kesalahan pada server';
          break;
        default:
          message = responseData?.message || 'Terjadi kesalahan';
      }
      
      return {
        message,
        status: error.response.status,
        errors: responseData?.errors,
      };
    } else if (error.request) {
      return {
        message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
        status: 0,
      };
    } else {
      return {
        message: 'Terjadi kesalahan yang tidak terduga',
        status: -1,
      };
    }
  }

  // Auth methods
  async login(email: string, password: string): Promise<AuthResponse> {
    const response: AxiosResponse<GoApiResponse<AuthResponse>> = await this.api.post('/auth/login', {
      email,
      password,
    });
    return response.data.data
  }

  async register(userData: {
    email: string;
    username: string;
    name: string;
    password: string;
    password_confirmation: string;
  }): Promise<RegisterResponse> {
    const response: AxiosResponse<GoApiResponse<RegisterResponse>> = await this.api.post('/auth/register', userData);
    return response.data.data; // Extract from Go API wrapper
  }

  async logout(): Promise<void> {
    // Simply clear tokens - no API call needed
    await this.clearAuthTokens();
  }

  async getProfile(): Promise<any> {
    const response: AxiosResponse<GoApiResponse<any>> = await this.api.get('/auth/me');
    return response.data.data; // Extract from Go API wrapper
  }

  async getProfileMe(): Promise<any> {
    const response: AxiosResponse<GoApiResponse<any>> = await this.api.get('/profile/me');
    return response.data.data; // Extract from Go API wrapper
  }

  async getDailyChallenge(): Promise<any> {
    const response: AxiosResponse<GoApiResponse<any>> = await this.api.get('/challenge/today');
    return response.data.data; // Extract from Go API wrapper
  }

  async getMyPackets(): Promise<any> {
    const response: AxiosResponse<GoApiResponse<any>> = await this.api.get('/packet/me');
    return response.data.data; // Extract from Go API wrapper
  }

  async getTodayTasks(): Promise<any> {
    const response: AxiosResponse<GoApiResponse<any>> = await this.api.get('/task');
    return response.data.data; // Extract from Go API wrapper
  }

  async updateTaskCompletion(taskId: number, completed: boolean): Promise<any> {
    const response: AxiosResponse<GoApiResponse<any>> = await this.api.put(`/task/${taskId}`, {
      completed
    });
    return response.data.data; // Extract from Go API wrapper
  }

  async getPacketDetail(packetId: number): Promise<any> {
    const response: AxiosResponse<GoApiResponse<any>> = await this.api.get(`/packet/detail/${packetId}`);
    return response.data.data; // Extract from Go API wrapper
  }

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
