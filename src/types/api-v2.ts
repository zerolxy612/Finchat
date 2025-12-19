/**
 * API v2 类型定义 (MVP版本)
 * 基于最新的API文档
 */

// ==================== 通用响应类型 ====================

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T = any> {
  total: number;
  pageNumber: number;
  pageSize: number;
  items: T[];
}

// ==================== 用户相关 ====================

export type UserRole = 'USER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED';

export interface User {
  id: string;
  username: string;
  nickname?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

// ==================== 认证相关 ====================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  nickname?: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  role: UserRole;
}

// ==================== 消息相关 ====================

export type MessageType = 
  | 'major_contract'
  | 'industry_policy'
  | 'earnings_forecast'
  | 'product_price_increase'
  | string; // 允许其他自定义类型

export interface SendMessageRequest {
  content?: string;
  type: MessageType;
  title?: string;
  file?: File;
}

export interface Message {
  id: string;
  trace_id: string;
  type: MessageType;
  title: string;
  content: string;
  response: MessageResponse;
  createdAt: string;
}

export interface MessageResponse {
  event_type: string;
  interpretation: {
    core_content: string;
    sentiment: string;
    confidence: number;
  };
  extracted_facts: Record<string, any>;
  path_text: string;
  risks: string[];
  general_risks: string[];
  disclaimer: string;
  trace_id: string;
  latency_ms: number;
}

// ==================== 历史记录相关 ====================

export interface HistoryItem {
  id: string;
  type: MessageType;
  title: string;
  createdAt: string;
}

export interface HistoryListRequest {
  pageNumber?: number;
  pageSize?: number;
  type?: MessageType;
}

export interface HistoryListResponse {
  total: number;
  pageNumber: number;
  pageSize: number;
  items: HistoryItem[];
}

