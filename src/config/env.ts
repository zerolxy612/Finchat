/**
 * 环境变量配置
 */

interface EnvConfig {
  apiBaseUrl: string;
  apiPrefix: string;
  apiTimeout: number;
  isDevelopment: boolean;
  isProduction: boolean;
}

const env: EnvConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  apiPrefix: import.meta.env.VITE_API_PREFIX || '/api/v1',
  apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

export default env;

