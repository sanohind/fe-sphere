import axios from 'axios';
import { config } from '../config/environment';

const API_BASE_URL = config.apiBaseUrl;

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor to include token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  name: string;
  nik?: string;
  phone_number?: string;
  avatar?: string;
  role: {
    id: number;
    name: string;
    slug: string;
    level: number;
  };
  department?: {
    id: number;
    name: string;
    code: string;
  };
  created_by?: {
    id: number;
    name: string;
  };
  is_active: boolean;
  email_verified_at?: string;
  last_login_at?: string;
  created_at: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
  };
}

export interface DashboardResponse {
  success: boolean;
  data: {
    user: User;
    projects: Project[];
  };
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  color: string;
  permissions: string[];
}

export interface ProjectUrlResponse {
  success: boolean;
  data: {
    url: string;
    project_id: string;
  };
}

class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const data = response.data;
      
      if (data.success) {
        // Store token and user data
        localStorage.setItem('token', data.data.access_token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }
      
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  /**
   * Get current user info
   */
  async getUserInfo(): Promise<User> {
    try {
      const response = await apiClient.get('/auth/user-info');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get user info');
    }
  }

  /**
   * Verify token
   */
  async verifyToken(): Promise<{ valid: boolean; user: User }> {
    try {
      const response = await apiClient.get('/auth/verify-token');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token verification failed');
    }
  }

  /**
   * Get dashboard data
   */
  async getDashboard(): Promise<DashboardResponse> {
    try {
      const response = await apiClient.get('/dashboard');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to load dashboard');
    }
  }

  /**
   * Get project access URL
   */
  async getProjectUrl(projectId: string): Promise<ProjectUrlResponse> {
    try {
      const response = await apiClient.get(`/dashboard/project/${projectId}/url`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get project URL');
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Get token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

export default new AuthService();
