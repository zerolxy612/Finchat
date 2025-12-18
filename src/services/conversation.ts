/**
 * 对话管理 API 服务
 */

import { request } from '../utils/request';
import type {
  ApiResponse,
  Conversation,
  ConversationDetail,
  CreateConversationRequest,
  UpdateConversationRequest,
} from '../types';

/**
 * 创建对话
 */
export const createConversation = (data: CreateConversationRequest): Promise<ApiResponse<Conversation>> => {
  return request.post('/conversations', data);
};

/**
 * 获取对话列表
 */
export const getConversations = (): Promise<ApiResponse<Conversation[]>> => {
  return request.get('/conversations');
};

/**
 * 获取对话详情（包含消息历史）
 */
export const getConversationDetail = (id: number): Promise<ApiResponse<ConversationDetail>> => {
  return request.get(`/conversations/${id}`);
};

/**
 * 更新对话标题
 */
export const updateConversation = (id: number, data: UpdateConversationRequest): Promise<ApiResponse<null>> => {
  return request.patch(`/conversations/${id}`, data);
};

/**
 * 删除对话
 */
export const deleteConversation = (id: number): Promise<ApiResponse<null>> => {
  return request.delete(`/conversations/${id}`);
};

/**
 * 归档对话
 */
export const archiveConversation = (id: number): Promise<ApiResponse<null>> => {
  return request.post(`/conversations/${id}/archive`);
};

