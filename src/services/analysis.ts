/**
 * 金融分析 API 服务
 */

import { request } from '../utils/request';
import type {
  AnalyzeRequest,
  AnalysisResponse,
  MajorContractResponse,
  IndustryPolicyResponse,
  EarningsForecastResponse,
  ProductPriceIncreaseResponse,
  HealthCheckResponse,
} from '../types';

/**
 * 健康检查
 */
export const healthCheck = (): Promise<HealthCheckResponse> => {
  return request.get('/health');
};

/**
 * 通用分析接口
 * @param data 分析请求数据
 * @returns 分析结果（根据 event_type 返回不同类型）
 */
export const analyze = (data: AnalyzeRequest): Promise<AnalysisResponse> => {
  return request.post('/analyze', data);
};

/**
 * 重大合同分析
 */
export const analyzeMajorContract = (
  text: string,
  trace_id?: string
): Promise<MajorContractResponse> => {
  return request.post('/analyze', {
    event_type: 'major_contract',
    text,
    trace_id,
  });
};

/**
 * 行业政策分析
 */
export const analyzeIndustryPolicy = (
  text: string,
  trace_id?: string
): Promise<IndustryPolicyResponse> => {
  return request.post('/analyze', {
    event_type: 'industry_policy',
    text,
    trace_id,
  });
};

/**
 * 业绩预告分析
 */
export const analyzeEarningsForecast = (
  text: string,
  trace_id?: string
): Promise<EarningsForecastResponse> => {
  return request.post('/analyze', {
    event_type: 'earnings_forecast',
    text,
    trace_id,
  });
};

/**
 * 产品提价分析
 */
export const analyzeProductPriceIncrease = (
  text: string,
  trace_id?: string
): Promise<ProductPriceIncreaseResponse> => {
  return request.post('/analyze', {
    event_type: 'product_price_increase',
    text,
    trace_id,
  });
};

