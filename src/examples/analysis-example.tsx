/**
 * 金融分析功能使用示例
 */

import { useState } from 'react';
import {
  analyze,
  analyzeMajorContract,
  analyzeIndustryPolicy,
  analyzeEarningsForecast,
  analyzeProductPriceIncrease,
  healthCheck,
} from '../services';
import type { EventType, AnalysisResponse } from '../types';

/**
 * 金融分析示例组件
 */
export const AnalysisExample = () => {
  const [eventType, setEventType] = useState<EventType>('major_contract');
  const [text, setText] = useState('');
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 健康检查
  const handleHealthCheck = async () => {
    try {
      const response = await healthCheck();
      console.log('健康检查:', response);
      alert(`状态: ${response.status}\n模型: ${response.llm_model}`);
    } catch (err) {
      console.error('健康检查失败:', err);
    }
  };

  // 通用分析
  const handleAnalyze = async () => {
    if (!text.trim()) {
      alert('请输入分析文本');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await analyze({
        event_type: eventType,
        text: text,
        trace_id: `web-${Date.now()}`,
      });
      setResult(response);
      console.log('分析结果:', response);
    } catch (err: any) {
      setError(err.message || '分析失败');
      console.error('分析失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 使用专用方法分析
  const handleSpecificAnalyze = async () => {
    if (!text.trim()) {
      alert('请输入分析文本');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let response: AnalysisResponse;

      switch (eventType) {
        case 'major_contract':
          response = await analyzeMajorContract(text, `web-${Date.now()}`);
          break;
        case 'industry_policy':
          response = await analyzeIndustryPolicy(text, `web-${Date.now()}`);
          break;
        case 'earnings_forecast':
          response = await analyzeEarningsForecast(text, `web-${Date.now()}`);
          break;
        case 'product_price_increase':
          response = await analyzeProductPriceIncrease(text, `web-${Date.now()}`);
          break;
      }

      setResult(response);
      console.log('分析结果:', response);
    } catch (err: any) {
      setError(err.message || '分析失败');
      console.error('分析失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 预设示例文本
  const exampleTexts: Record<EventType, string> = {
    major_contract: 'XX公司公告：公司与YY公司签订设备采购合同，合同总金额约12亿元人民币，履行期限为2026年12月前。若顺利执行将对公司未来经营业绩产生积极影响。',
    industry_policy: '《关于促进储能行业高质量发展的指导意见》：到2027年新型储能装机规模显著提升，支持电化学储能关键材料与装备国产化，鼓励电网侧、工商业侧储能示范应用；加强安全标准与准入管理，严控低质产能。',
    earnings_forecast: 'ZZ公司2025年度业绩预告：预计2025年归母净利润为8.0亿元-9.2亿元，同比增长45%-65%；扣非净利润为7.2亿元-8.5亿元，同比增长40%-60%。业绩增长主要由于核心产品销量提升、原材料成本下降以及费用率改善。',
    product_price_increase: 'AA公司通知：自2026年1月1日起，对部分工业级硅胶产品价格上调8%-12%。提价原因包括上游原料价格上涨、环保治理投入增加以及部分产能检修导致供给偏紧。',
  };

  const loadExample = () => {
    setText(exampleTexts[eventType]);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>金融分析功能示例</h1>

      <button onClick={handleHealthCheck} style={{ marginBottom: '20px' }}>
        健康检查
      </button>

      <div style={{ marginBottom: '20px' }}>
        <h3>选择分析类型</h3>
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value as EventType)}
          style={{ padding: '8px', fontSize: '14px' }}
        >
          <option value="major_contract">重大合同</option>
          <option value="industry_policy">行业政策</option>
          <option value="earnings_forecast">业绩预告</option>
          <option value="product_price_increase">产品提价</option>
        </select>
        <button onClick={loadExample} style={{ marginLeft: '10px' }}>
          加载示例文本
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>输入分析文本</h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="请输入要分析的公告文本..."
          rows={6}
          style={{ width: '100%', padding: '10px', fontSize: '14px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{ marginRight: '10px', padding: '10px 20px' }}
        >
          {loading ? '分析中...' : '通用分析'}
        </button>
        <button
          onClick={handleSpecificAnalyze}
          disabled={loading}
          style={{ padding: '10px 20px' }}
        >
          {loading ? '分析中...' : '专用方法分析'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '10px', background: '#fee', border: '1px solid #fcc', marginBottom: '20px' }}>
          <strong>错误:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h2>分析结果</h2>

          <div style={{ marginBottom: '20px' }}>
            <h3>核心解读</h3>
            <p><strong>内容:</strong> {result.interpretation.core_content}</p>
            <p><strong>情绪:</strong> {result.interpretation.sentiment}</p>
            <p><strong>置信度:</strong> {result.interpretation.confidence}%</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3>传导链路</h3>
            <pre style={{ background: '#f5f5f5', padding: '10px', whiteSpace: 'pre-wrap' }}>
              {result.path_text}
            </pre>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3>风险提示</h3>
            <ul>
              {result.risks.map((risk, index) => (
                <li key={index}>{risk}</li>
              ))}
            </ul>
            <p><strong>一般风险:</strong></p>
            <ul>
              {result.general_risks.map((risk, index) => (
                <li key={index}>{risk}</li>
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3>提取的事实</h3>
            <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
              {JSON.stringify(result.extracted_facts, null, 2)}
            </pre>
          </div>

          <div style={{ fontSize: '12px', color: '#666' }}>
            <p><strong>免责声明:</strong> {result.disclaimer}</p>
            <p><strong>追踪ID:</strong> {result.trace_id}</p>
            <p><strong>耗时:</strong> {result.latency_ms}ms</p>
          </div>
        </div>
      )}
    </div>
  );
};

