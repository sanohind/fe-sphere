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

export interface Department {
  id: number;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateDepartmentData {
  name: string;
  code: string;
  description?: string;
  is_active?: boolean;
}

export interface UpdateDepartmentData {
  name?: string;
  code?: string;
  description?: string;
  is_active?: boolean;
}

export interface DepartmentsResponse {
  success: boolean;
  data: Department[];
}

export interface DepartmentResponse {
  success: boolean;
  data: Department;
  message?: string;
}

class DepartmentService {
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

  /**
   * Get department by ID
   */
  async getDepartment(id: number): Promise<DepartmentResponse> {
    try {
      const response = await apiClient.get(`/departments/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch department');
    }
  }

  /**
   * Create new department
   */
  async createDepartment(departmentData: CreateDepartmentData): Promise<DepartmentResponse> {
    try {
      const response = await apiClient.post('/departments', departmentData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create department');
    }
  }

  /**
   * Update department
   */
  async updateDepartment(id: number, departmentData: UpdateDepartmentData): Promise<DepartmentResponse> {
    try {
      const response = await apiClient.put(`/departments/${id}`, departmentData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update department');
    }
  }

  /**
   * Delete department
   */
  async deleteDepartment(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`/departments/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete department');
    }
  }
}

export default new DepartmentService();

