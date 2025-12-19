/**
 * API 服务层 V2 (MVP版本)
 * 基于最新的API文档
 */

import { request, tokenManager } from '../utils/request-v2';
import axiosInstance from '../utils/request-v2';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  SendMessageRequest,
  Message,
  HistoryListRequest,
  HistoryListResponse,
} from '../types/api-v2';

// ==================== 认证 API ====================

/**
 * 用户登录
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await request.post<LoginResponse>('/auth/login', data);
  // 保存 Token
  if (response.accessToken) {
    tokenManager.setToken(response.accessToken);
  }
  return response;
};

/**
 * 用户注册
 */
export const register = async (data: RegisterRequest): Promise<void> => {
  await request.post('/auth/register', data);
};

/**
 * 退出登录
 */
export const logout = (): void => {
  tokenManager.removeToken();
};

// ==================== 消息 API ====================

/**
 * 发送消息（文本输入）
 */
export const sendMessage = async (data: SendMessageRequest): Promise<Message> => {
  return request.post<Message>('/messages', data);
};

/**
 * 发送消息（文件上传）
 */
export const sendMessageWithFile = async (
  file: File,
  type: string,
  title?: string
): Promise<Message> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  if (title) {
    formData.append('title', title);
  }

  const token = tokenManager.getToken();
  const response = await axiosInstance.post('/messages', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  return response.data.data;
};

/**
 * 获取消息详情
 */
export const getMessageDetail = async (id: string): Promise<Message> => {
  return request.get<Message>(`/messages/${id}`);
};

// ==================== 历史记录 API ====================

/**
 * 获取历史记录列表
 */
export const getHistoryList = async (
  params?: HistoryListRequest
): Promise<HistoryListResponse> => {
  return request.get<HistoryListResponse>('/history', { params });
};

// ==================== 导出所有 API ====================

export const apiV2 = {
  // 认证
  login,
  register,
  logout,
  
  // 消息
  sendMessage,
  sendMessageWithFile,
  getMessageDetail,
  
  // 历史记录
  getHistoryList,
};

export default apiV2;

