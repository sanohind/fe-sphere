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

export interface AuditLog {
  id: number;
  user_id: number;
  action: string;
  entity_type: string;
  entity_id: number;
  old_values: any;
  new_values: any;
  ip_address: string;
  user_agent: string;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface AuditLogResponse {
  success: boolean;
  data: AuditLog[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export interface AuditLogFilters {
  search?: string;
  action?: string;
  entity_type?: string;
  date_from?: string;
  date_to?: string;
  per_page?: number;
  page?: number;
}

class AuditLogService {
  /**
   * Get audit logs with optional filters
   */
  async getLogs(filters: AuditLogFilters = {}): Promise<AuditLogResponse> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get(`/audit-logs?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch audit logs');
    }
  }

  /**
   * Get single audit log by ID
   */
  async getLog(id: number): Promise<{ success: boolean; data: AuditLog }> {
    try {
      const response = await apiClient.get(`/audit-logs/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch audit log');
    }
  }

  /**
   * Get available actions for filtering
   */
  async getAvailableActions(): Promise<{ success: boolean; data: string[] }> {
    try {
      const response = await apiClient.get('/audit-logs/filters/actions');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch available actions');
    }
  }

  /**
   * Get available entity types for filtering
   */
  async getAvailableEntityTypes(): Promise<{ success: boolean; data: string[] }> {
    try {
      const response = await apiClient.get('/audit-logs/filters/entity-types');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch available entity types');
    }
  }
}

export default new AuditLogService();
