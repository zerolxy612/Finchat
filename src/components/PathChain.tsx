/**
 * 传导链路可视化组件
 * 支持多链路展示、步骤卡片、因果高亮
 */

import React from 'react';

interface PathChainProps {
  pathText: string;
}

interface ChainStep {
  text: string;
  isResult: boolean; // 是否为结果节点（带⭐或特殊标记）
}

interface ParsedChain {
  steps: ChainStep[];
  reason?: string; // 括号内的理由
}

/**
 * 解析单条链路文本
 * 例如："XX公司 → 签订设备采购合同 → 采购高价值设备 → 提升生产能力 → 增加市场销售 → 带动业绩增长（合同金额大，覆盖多年）"
 */
const parseChainText = (chainText: string): ParsedChain => {
  // 提取括号内的理由
  const reasonMatch = chainText.match(/[（(]([^）)]+)[）)]/);
  const reason = reasonMatch ? reasonMatch[1] : undefined;
  
  // 移除括号部分，只保留链路
  const cleanText = chainText.replace(/[（(][^）)]+[）)]/g, '').trim();
  
  // 按箭头分割步骤（支持 →、-> 两种箭头）
  const stepTexts = cleanText
    .split(/\s*(?:→|->)\s*/)
    .map(s => s.replace(/\\n/g, ' ').trim()) // 清理转义的换行符
    .filter(s => s.length > 0);
  
  // 识别结果节点（通常是最后一步，或包含"增长"、"提升"等关键词）
  const steps: ChainStep[] = stepTexts.map((text, idx) => {
    const isResult = 
      idx === stepTexts.length - 1 || // 最后一步
      /增长|提升|提高|改善|优化/.test(text); // 包含结果关键词
    
    return { text, isResult };
  });
  
  return { steps, reason };
};

/**
 * 解析多条链路（按换行符分割）
 * 支持真实换行符 \n 和转义的 \\n
 */
const parseMultipleChains = (pathText: string): ParsedChain[] => {
  // 先将转义的 \\n 替换为真实换行符
  const normalizedText = pathText.replace(/\\n/g, '\n');

  return normalizedText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(parseChainText);
};

/**
 * 单条链路渲染组件
 */
const ChainRow: React.FC<{ chain: ParsedChain; index: number }> = ({ chain, index }) => {
  return (
    <div
      style={{
        marginBottom: '16px',
        padding: '16px',
        background: 'white',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      {/* 链路标题 */}
      <div
        style={{
          fontSize: '13px',
          color: '#666',
          marginBottom: '12px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span style={{ color: index === 0 ? '#1890ff' : '#52c41a' }}>
          {index === 0 ? '📈' : '🔄'}
        </span>
        链路 {index + 1}
      </div>

      {/* 步骤流 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: chain.reason ? '12px' : '0',
        }}
      >
        {chain.steps.map((step, idx) => (
          <React.Fragment key={idx}>
            {/* 步骤卡片 */}
            <div
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                lineHeight: '1.4',
                background: step.isResult ? '#fff7e6' : '#f0f5ff',
                border: step.isResult ? '1px solid #ffd591' : '1px solid #adc6ff',
                color: step.isResult ? '#d46b08' : '#1890ff',
                fontWeight: step.isResult ? '600' : '400',
                transition: 'all 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {step.isResult && '⭐ '}
              {step.text}
            </div>

            {/* 箭头 */}
            {idx < chain.steps.length - 1 && (
              <span style={{ color: '#bfbfbf', fontSize: '16px', fontWeight: '300' }}>
                →
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 理由说明 */}
      {chain.reason && (
        <div
          style={{
            fontSize: '12px',
            color: '#8c8c8c',
            padding: '8px 12px',
            background: '#fafafa',
            borderRadius: '4px',
            borderLeft: '3px solid #d9d9d9',
          }}
        >
          💡 {chain.reason}
        </div>
      )}
    </div>
  );
};

/**
 * 主组件
 */
export const PathChain: React.FC<PathChainProps> = ({ pathText }) => {
  const chains = parseMultipleChains(pathText);

  return (
    <div>
      {chains.map((chain, index) => (
        <ChainRow key={index} chain={chain} index={index} />
      ))}
    </div>
  );
};

