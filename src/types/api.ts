/**
 * API 通用类型定义
 */

// ========== 通用响应类型 ==========
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T = any> {
  code: number;
  message: string;
  data: T[];
  total: number;
  pageNumber: number;
  pageSize: number;
}

// ========== 用户相关类型 ==========
export type UserRole = 'USER' | 'ADMIN';
export type UserStatus = 0 | 1; // 0=正常，1=禁用

export interface User {
  id: number;
  username: string;
  nickname: string;
  emailAddress: string;
  phoneNumber: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserDetail extends User {
  chatDialogCount: number;
  isMember: boolean;
  subscribeStartDate: string;
  subscribeEndDate: string;
  usageDays: number;
}

// ========== 认证相关类型 ==========
export type VerificationScope = 'SIGN_UP' | 'RESET_PASSWORD';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface EmailLoginRequest {
  emailAddress: string;
  verificationCode: string;
}

export interface RegisterRequest {
  emailAddress: string;
  verificationCode: string;
  password: string;
  nickname?: string;
}

export interface SendVerificationCodeRequest {
  emailAddress: string;
  scope: VerificationScope;
}

export interface ResetPasswordRequest {
  emailAddress: string;
  verificationCode: string;
  newPassword: string;
}

// ========== 对话相关类型 ==========
export type ConversationType = 'general' | 'financial';
export type ConversationStatus = 'ACTIVE' | 'ARCHIVED';

export interface Conversation {
  id: number;
  title: string;
  type: ConversationType;
  status: ConversationStatus;
  messageCount: number;
  createdAt: string;
  lastActiveAt: string;
}

export interface CreateConversationRequest {
  title: string;
  type: ConversationType;
}

export interface UpdateConversationRequest {
  title: string;
}

// ========== 消息相关类型 ==========
export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageMode = 'standard' | 'financial';
export type FeedbackType = 'LIKE' | 'DISLIKE' | 'SUGGESTION';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  parentId: string | null;
  attachments: Attachment[];
  feedback: MessageFeedback | null;
  createdAt: string;
}

export interface ConversationDetail extends Conversation {
  messages: Message[];
}

export interface GenerateMessageRequest {
  conversationId: number;
  content: string;
  mode?: MessageMode;
  persistFlag?: 0 | 1; // 0=不保存，1=保存
  attachmentIds?: string[];
  messageId?: string;
  parentMessageId?: string;
}

export interface MessageFeedback {
  type: FeedbackType;
  comment?: string;
}

export interface SubmitFeedbackRequest {
  type: FeedbackType;
  comment?: string;
}

// ========== 附件相关类型 ==========
export type AttachmentType = 'pdf' | 'word' | 'text' | 'image' | 'audio';

export interface Attachment {
  id: string;
  url: string;
  type: AttachmentType;
  fileName: string;
  fileSize: number;
}

// ========== 管理员相关类型 ==========
export interface UserSearchParams {
  keyword?: string;
  role?: UserRole;
  status?: UserStatus;
  pageNumber?: number;
  pageSize?: number;
}

export interface UpdateUserRequest {
  username?: string;
  password?: string;
  nickname?: string;
  avatarUrl?: string;
  emailAddress?: string;
  phoneNumber?: string;
  role?: UserRole;
  status?: UserStatus;
}

