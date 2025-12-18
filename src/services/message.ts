/**
 * 消息生成 API 服务
 */

import { request } from '../utils/request';
import { env } from '../config';
import type {
  ApiResponse,
  GenerateMessageRequest,
  SubmitFeedbackRequest,
} from '../types';

/**
 * 流式生成消息（SSE）
 * @param data 消息生成请求
 * @param onMessage 接收到消息片段的回调
 * @param onComplete 完成时的回调
 * @param onError 错误时的回调
 */
export const generateMessage = (
  data: GenerateMessageRequest,
  onMessage: (chunk: string) => void,
  onComplete?: () => void,
  onError?: (error: Error) => void
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const url = `${env.apiBaseUrl}${env.apiPrefix}/messages/generate`;

    // 使用 fetch API 处理 SSE
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      credentials: 'include', // 重要：携带 Cookie
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error('Response body is null');
        }

        // 读取流数据
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            onComplete?.();
            resolve();
            break;
          }

          // 解码数据
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const content = line.slice(6); // 移除 "data: " 前缀

              // 检查是否结束
              if (content === '[DONE]') {
                onComplete?.();
                resolve();
                return;
              }

              // 调用回调函数
              onMessage(content);
            }
          }
        }
      })
      .catch((error) => {
        console.error('❌ SSE Error:', error);
        onError?.(error);
        reject(error);
      });
  });
};

/**
 * 删除消息
 */
export const deleteMessage = (messageId: string): Promise<ApiResponse<null>> => {
  return request.delete(`/messages/${messageId}`);
};

/**
 * 提交消息反馈
 */
export const submitFeedback = (messageId: string, data: SubmitFeedbackRequest): Promise<ApiResponse<null>> => {
  return request.post(`/messages/${messageId}/feedback`, data);
};

