/**
 * 认证相关 API 服务
 */

import { request } from '../utils/request';
import type {
  ApiResponse,
  User,
  LoginRequest,
  EmailLoginRequest,
  RegisterRequest,
  SendVerificationCodeRequest,
  ResetPasswordRequest,
} from '../types';

/**
 * 用户名密码登录
 */
export const login = (data: LoginRequest): Promise<ApiResponse<null>> => {
  return request.post('/auth/login', data);
};

/**
 * 邮箱验证码登录
 */
export const loginWithEmail = (data: EmailLoginRequest): Promise<ApiResponse<null>> => {
  return request.post('/auth/login/email', data);
};

/**
 * 用户登出
 */
export const logout = (): Promise<ApiResponse<null>> => {
  return request.post('/auth/logout');
};

/**
 * 发送邮箱验证码
 */
export const sendVerificationCode = (data: SendVerificationCodeRequest): Promise<ApiResponse<null>> => {
  return request.post('/auth/verification/email', data);
};

/**
 * 用户注册
 */
export const register = (data: RegisterRequest): Promise<ApiResponse<null>> => {
  return request.post('/auth/register', data);
};

/**
 * 重置密码
 */
export const resetPassword = (data: ResetPasswordRequest): Promise<ApiResponse<null>> => {
  return request.put('/auth/password/reset', data);
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = (): Promise<ApiResponse<User>> => {
  return request.get('/auth/current');
};

