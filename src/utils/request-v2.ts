/**
 * HTTP 请求工具 V2 (MVP版本)
 * 支持 JWT Token 认证
 */

import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { env } from '../config';
import type { ApiResponse } from '../types/api-v2';

// ==================== Token 管理 ====================

const TOKEN_KEY = 'finchat_access_token';

export const tokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },
};

// ==================== Axios 实例 ====================

const instance: AxiosInstance = axios.create({
  baseURL: `${env.apiBaseUrl}${env.apiPrefix}`,
  timeout: env.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== 请求拦截器 ====================

instance.interceptors.request.use(
  (config) => {
    // 自动添加 JWT Token
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (env.isDevelopment) {
      console.log('📤 Request:', config.method?.toUpperCase(), config.url, config.data);
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// ==================== 响应拦截器 ====================

instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response;

    if (env.isDevelopment) {
      console.log('📥 Response:', response.config.url, data);
    }

    // 检查业务状态码
    if (data.code === 200) {
      return response;
    }

    // 处理业务错误
    const errorMessage = data.message || '请求失败';
    console.error('❌ Business Error:', errorMessage);
    
    return Promise.reject(new Error(errorMessage));
  },
  (error: AxiosError<ApiResponse>) => {
    // 处理 HTTP 错误
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          console.error('❌ 未认证，Token无效或过期');
          // 清除 Token 并跳转到登录页
          tokenManager.removeToken();
          // window.location.href = '/login';
          break;
        case 403:
          console.error('❌ 无权限访问');
          break;
        case 404:
          console.error('❌ 请求的资源不存在');
          break;
        case 500:
          console.error('❌ 服务器错误');
          break;
        default:
          console.error(`❌ HTTP Error ${status}:`, data?.message || error.message);
      }
      
      return Promise.reject(new Error(data?.message || error.message));
    }

    // 网络错误
    if (error.code === 'ECONNABORTED') {
      console.error('❌ 请求超时');
      return Promise.reject(new Error('请求超时'));
    } else if (error.message === 'Network Error') {
      console.error('❌ 网络错误，请检查网络连接');
      return Promise.reject(new Error('网络错误，请检查网络连接'));
    } else {
      console.error('❌ 请求失败:', error.message);
      return Promise.reject(error);
    }
  }
);

// ==================== 封装请求方法 ====================

export const request = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return instance.get(url, config).then((res) => res.data.data);
  },

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return instance.post(url, data, config).then((res) => res.data.data);
  },

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return instance.put(url, data, config).then((res) => res.data.data);
  },

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return instance.patch(url, data, config).then((res) => res.data.data);
  },

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return instance.delete(url, config).then((res) => res.data.data);
  },
};

// 导出 axios 实例（用于特殊场景，如文件上传）
export default instance;

