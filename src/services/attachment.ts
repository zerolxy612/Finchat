/**
 * 文件管理 API 服务
 */

import axios from '../utils/request';
import type { ApiResponse, Attachment } from '../types';

/**
 * 上传单个文件
 */
export const uploadFile = (file: File): Promise<ApiResponse<Attachment>> => {
  const formData = new FormData();
  formData.append('file', file);

  return axios.post('/attachments', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then((res) => res.data);
};

/**
 * 批量上传文件
 */
export const uploadFiles = (files: File[]): Promise<ApiResponse<Attachment[]>> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  return axios.post('/attachments/batch', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then((res) => res.data);
};

/**
 * 删除文件
 */
export const deleteFile = (id: string): Promise<ApiResponse<null>> => {
  return axios.delete(`/attachments/${id}`).then((res) => res.data);
};

