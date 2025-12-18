/**
 * HTTP 请求工具
 * 基于 axios 封装，包含请求/响应拦截器
 */

import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { env } from '../config';
import type { ApiResponse } from '../types';

// 创建 axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: `${env.apiBaseUrl}${env.apiPrefix}`,
  timeout: env.apiTimeout,
  withCredentials: true, // 重要：支持 Session Cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 可以在这里添加 token 或其他请求头
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

// 响应拦截器
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
    
    // 可以在这里统一处理错误提示
    // 例如：message.error(errorMessage);
    
    return Promise.reject(new Error(errorMessage));
  },
  (error: AxiosError<ApiResponse>) => {
    // 处理 HTTP 错误
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          console.error('❌ 未认证，请先登录');
          // 可以在这里跳转到登录页
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
      
      return Promise.reject(error);
    }

    // 网络错误
    if (error.code === 'ECONNABORTED') {
      console.error('❌ 请求超时');
    } else if (error.message === 'Network Error') {
      console.error('❌ 网络错误，请检查网络连接');
    } else {
      console.error('❌ 请求失败:', error.message);
    }

    return Promise.reject(error);
  }
);

// 封装请求方法
export const request = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return instance.get(url, config).then((res) => res.data);
  },

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return instance.post(url, data, config).then((res) => res.data);
  },

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return instance.put(url, data, config).then((res) => res.data);
  },

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return instance.patch(url, data, config).then((res) => res.data);
  },

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return instance.delete(url, config).then((res) => res.data);
  },
};

// 导出 axios 实例（用于特殊场景，如文件上传）
export default instance;

