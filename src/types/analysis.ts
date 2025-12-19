/**
 * 金融分析相关类型定义
 */

// ========== 事件类型 ==========
export type EventType = 
  | 'major_contract'        // 重大合同
  | 'industry_policy'       // 行业政策
  | 'earnings_forecast'     // 业绩预告
  | 'product_price_increase'; // 产品提价

// ========== 分析请求 ==========
export interface AnalyzeRequest {
  event_type: EventType;
  text: string;
  trace_id?: string;
}

// ========== 通用分析响应结构 ==========
export interface Interpretation {
  core_content: string;
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed' | 'unknown';
  confidence: number; // 0-100
}

export interface SourceQuote {
  quote: string;
  why: string;
}

// ========== 重大合同 (major_contract) ==========
export interface MajorContractFacts {
  company: string | null;
  counterparty: string | null;
  amount: string | null;
  scope: string | null;
  duration: string | null;
  sign_date: string | null;
  conditions: string | null;
  materiality: string | null;
  source_quotes: SourceQuote[];
}

export interface MajorContractResponse {
  event_type: 'major_contract';
  interpretation: Interpretation;
  extracted_facts: MajorContractFacts;
  path_text: string;
  risks: string[];
  general_risks: string[];
  disclaimer: string;
  trace_id: string;
  latency_ms: number;
}

// ========== 行业政策 (industry_policy) ==========
export interface IndustryPolicyFacts {
  policy_title: string | null;
  issuer: string | null;
  target_domain: string | null;
  key_measures: string[];
  timeline: string | null;
  constraints: string[];
  source_quotes: SourceQuote[];
}

export interface IndustryPolicyResponse {
  event_type: 'industry_policy';
  interpretation: Interpretation;
  extracted_facts: IndustryPolicyFacts;
  path_text: string;
  risks: string[];
  general_risks: string[];
  disclaimer: string;
  trace_id: string;
  latency_ms: number;
}

// ========== 业绩预告 (earnings_forecast) ==========
export interface EarningsForecastFacts {
  company: string | null;
  period: string | null;
  revenue_range: string | null;
  profit_range: string | null;
  profit_yoy: string | null;
  profit_qoq: string | null;
  non_gaap_profit_range: string | null;
  drivers: string[];
  one_off_items: string | null;
  source_quotes: SourceQuote[];
}

export interface EarningsForecastResponse {
  event_type: 'earnings_forecast';
  interpretation: Interpretation;
  extracted_facts: EarningsForecastFacts;
  path_text: string;
  risks: string[];
  general_risks: string[];
  disclaimer: string;
  trace_id: string;
  latency_ms: number;
}

// ========== 产品提价 (product_price_increase) ==========
export interface ProductPriceIncreaseFacts {
  company: string | null;
  products: string[];
  price_change: string | null;
  effective_date: string | null;
  reasons: string[];
  pass_through: string | null;
  source_quotes: SourceQuote[];
}

export interface ProductPriceIncreaseResponse {
  event_type: 'product_price_increase';
  interpretation: Interpretation;
  extracted_facts: ProductPriceIncreaseFacts;
  path_text: string;
  risks: string[];
  general_risks: string[];
  disclaimer: string;
  trace_id: string;
  latency_ms: number;
}

// ========== 联合类型 ==========
export type AnalysisResponse = 
  | MajorContractResponse
  | IndustryPolicyResponse
  | EarningsForecastResponse
  | ProductPriceIncreaseResponse;

// ========== 健康检查 ==========
export interface HealthCheckResponse {
  status: string;
  llm_base_url: string;
  llm_model: string;
}

