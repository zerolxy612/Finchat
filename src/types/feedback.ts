/**
 * 反馈管理相关类型定义
 */

import type { FeedbackType } from './api';

// ========== 反馈列表类型 ==========
export interface LikeFeedback {
  messageId: string;
  content: string;
  feedbackType: FeedbackType;
  userId: string;
  username: string;
  createdAt: string;
  feedbackAt: string;
}

export interface SuggestionFeedback {
  messageId: string;
  content: string;
  feedbackComment: string;
  status: 2 | 3; // 2=未处理，3=已完成
  userId: string;
  username: string;
  createdAt: string;
  feedbackAt: string;
}

export interface FeedbackSearchParams {
  keyword?: string;
  status?: 2 | 3;
  pageNumber?: number;
  pageSize?: number;
}

