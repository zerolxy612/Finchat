/**
 * 管理员 API 服务
 */

import { request } from '../utils/request';
import type {
  PaginatedResponse,
  ApiResponse,
  User,
  UserDetail,
  UserSearchParams,
  UpdateUserRequest,
} from '../types';
import type { LikeFeedback, SuggestionFeedback, FeedbackSearchParams } from '../types/feedback';

// ========== 用户管理 ==========

/**
 * 搜索用户列表
 */
export const searchUsers = (params?: UserSearchParams): Promise<PaginatedResponse<User>> => {
  return request.get('/admin/users', { params });
};

/**
 * 获取用户详情
 */
export const getUserDetail = (id: number): Promise<ApiResponse<UserDetail>> => {
  return request.get(`/admin/users/${id}`);
};

/**
 * 更新用户信息
 */
export const updateUser = (id: number, data: UpdateUserRequest): Promise<ApiResponse<null>> => {
  return request.put(`/admin/users/${id}`, data);
};

/**
 * 删除用户
 */
export const deleteUser = (id: number): Promise<ApiResponse<null>> => {
  return request.delete(`/admin/users/${id}`);
};

// ========== 反馈管理 ==========

/**
 * 获取点赞反馈列表
 */
export const getLikeFeedbacks = (params?: FeedbackSearchParams): Promise<PaginatedResponse<LikeFeedback>> => {
  return request.get('/admin/feedback/likes', { params });
};

/**
 * 获取建议反馈列表
 */
export const getSuggestionFeedbacks = (params?: FeedbackSearchParams): Promise<PaginatedResponse<SuggestionFeedback>> => {
  return request.get('/admin/feedback/suggestions', { params });
};

/**
 * 更新建议反馈状态
 */
export const updateSuggestionStatus = (messageId: string, status: 2 | 3): Promise<ApiResponse<null>> => {
  return request.patch(`/admin/feedback/suggestions/${messageId}`, null, {
    params: { status },
  });
};

