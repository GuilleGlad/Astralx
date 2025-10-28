import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  LoginRequest,
  RegisterRequest,
  UserRole,
} from '../types/auth.types';
import { apiService } from '../services/api.service';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<{ message: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ message: string }>;
  resetPassword: (
    token: string,
    newPassword: string
  ) => Promise<{ message: string }>;
  verifyEmail: (token: string) => Promise<{ message: string }>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const accessToken = await AsyncStorage.getItem('accessToken');

      if (storedUser && accessToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Failed to load user from storage:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginRequest) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await apiService.login(data);
      setUser(response.user);
    } catch (err) {
      const errorMessage = apiService.getApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await apiService.register(data);
      return response;
    } catch (err) {
      const errorMessage = apiService.getApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await apiService.logout();
      setUser(null);
    } catch (err) {
      const errorMessage = apiService.getApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setError(null);
      setIsLoading(true);
      return await apiService.forgotPassword(email);
    } catch (err) {
      const errorMessage = apiService.getApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setError(null);
      setIsLoading(true);
      return await apiService.resetPassword(token, newPassword);
    } catch (err) {
      const errorMessage = apiService.getApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      setError(null);
      setIsLoading(true);
      return await apiService.verifyEmail(token);
    } catch (err) {
      const errorMessage = apiService.getApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        verifyEmail,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
