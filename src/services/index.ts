/**
 * API 服务统一导出
 */

import * as authService from './auth';
import * as conversationService from './conversation';
import * as messageService from './message';
import * as attachmentService from './attachment';
import * as adminService from './admin';

export {
  authService,
  conversationService,
  messageService,
  attachmentService,
  adminService,
};

// 也可以单独导出
export * from './auth';
export * from './conversation';
export * from './message';
export * from './attachment';
export * from './admin';

