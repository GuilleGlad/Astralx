import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  ApiError,
} from '../types/auth.types';

const API_URL = __DEV__
  ? 'http://localhost:3000/api'
  : 'https://api.astralx.com/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          originalRequest &&
          !(originalRequest as any)._retry
        ) {
          (originalRequest as any)._retry = true;

          try {
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await axios.post(`${API_URL}/auth/refresh`, {
                refreshToken,
              });
              const { accessToken, refreshToken: newRefreshToken } =
                response.data;

              await AsyncStorage.setItem('accessToken', accessToken);
              await AsyncStorage.setItem('refreshToken', newRefreshToken);

              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            await this.clearTokens();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async register(data: RegisterRequest): Promise<{ message: string }> {
    const response = await this.api.post('/auth/register', data);
    return response.data;
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>('/auth/login', data);
    const { accessToken, refreshToken, user } = response.data;

    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    await AsyncStorage.setItem('user', JSON.stringify(user));

    return response.data;
  }

  async logout(): Promise<void> {
    await this.clearTokens();
  }

  async getProfile(): Promise<User> {
    const response = await this.api.get<User>('/auth/profile');
    return response.data;
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await this.api.post('/auth/forgot-password', { email });
    return response.data;
  }

  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const response = await this.api.post('/auth/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await this.api.get(`/auth/verify-email?token=${token}`);
    return response.data;
  }

  private async clearTokens(): Promise<void> {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('user');
  }

  getApiError(error: any): string {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;
      return (
        axiosError.response?.data?.message ||
        'An unexpected error occurred. Please try again.'
      );
    }
    return 'An unexpected error occurred. Please try again.';
  }
}

export const apiService = new ApiService();
