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
    description?: string;
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
  updated_at: string;
}

export interface CreateUserData {
  email: string;
  username: string;
  password: string;
  name: string;
  nik?: string;
  phone_number?: string;
  role_id: number;
  department_id?: number;
  is_active?: boolean;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
}

export interface DepartmentsResponse {
  success: boolean;
  data: Department[];
}

export interface UpdateUserData {
  email?: string;
  username?: string;
  password?: string;
  name?: string;
  nik?: string;
  phone_number?: string;
  is_active?: boolean;
}

export interface Role {
  id: number;
  name: string;
  slug: string;
  level: number;
  description?: string;
  is_active: boolean;
}

export interface UsersResponse {
  success: boolean;
  data: User[];
}

export interface UserResponse {
  success: boolean;
  data: User;
  message?: string;
}

export interface RolesResponse {
  success: boolean;
  data: Role[];
}

class UserService {
  /**
   * Get all users
   */
  async getUsers(): Promise<UsersResponse> {
    try {
      const response = await apiClient.get('/users');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  }

  /**
   * Get user by ID
   */
  async getUser(id: number): Promise<UserResponse> {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  }

  /**
   * Create new user
   */
  async createUser(userData: CreateUserData): Promise<UserResponse> {
    try {
      const response = await apiClient.post('/users', userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create user');
    }
  }

  /**
   * Update user
   */
  async updateUser(id: number, userData: UpdateUserData): Promise<UserResponse> {
    try {
      const response = await apiClient.put(`/users/${id}`, userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
  }

  /**
   * Delete user
   */
  async deleteUser(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`/users/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  }

  /**
   * Get available roles
   */
  async getAvailableRoles(): Promise<RolesResponse> {
    try {
      const response = await apiClient.get('/users/roles/available');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch roles');
    }
  }

  /**
   * Get all departments
   */
  async getDepartments(): Promise<DepartmentsResponse> {
    try {
      const response = await apiClient.get('/departments');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch departments');
    }
  }
}

export default new UserService();
