import { useEffect, useState } from 'react';
import './index.css';
import { getHistoryList, getMessageDetail, login, register, sendMessage, sendMessageWithFile } from './services/api-v2';
import type { MessageType, Message, HistoryItem } from './types/api-v2';
import { PathChain } from './components/PathChain';

// 辅助函数：格式化字段名称
const formatFieldName = (key: string): string => {
  const fieldNameMap: Record<string, string> = {
    company: '公司名称',
    counterparty: '合作方',
    amount: '合同金额',
    scope: '合同范围',
    duration: '履行期限',
    sign_date: '签订日期',
    conditions: '合同条件',
    materiality: '重要性说明',
    policy_name: '政策名称',
    issuing_authority: '发布机构',
    target_year: '目标年份',
    key_targets: '关键目标',
    support_measures: '支持措施',
    regulatory_requirements: '监管要求',
    forecast_year: '预告年份',
    net_profit_range: '归母净利润',
    net_profit_growth: '净利润增长',
    adjusted_net_profit_range: '扣非净利润',
    adjusted_net_profit_growth: '扣非增长',
    growth_drivers: '增长驱动',
    previous_year_net_profit: '上年净利润',
    product_category: '产品类别',
    price_increase_range: '提价幅度',
    effective_date: '生效日期',
    reasons: '提价原因',
    source_quotes: '来源引用',
  };

  return fieldNameMap[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// 登录页面组件
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('请填写完整信息');
      return;
    }

    if (!isLogin) {
      // 注册逻辑
      if (password !== confirmPassword) {
        setError('两次密码不一致');
        return;
      }

      try {
        setLoading(true);
        await register({
          username: username,
          password: password,
          nickname: nickname.trim() || undefined,
        });
        alert('注册成功！请登录');
        setIsLogin(true);
        setPassword('');
        setConfirmPassword('');
        setNickname('');
      } catch (err: any) {
        setError(err.message || '注册失败');
      } finally {
        setLoading(false);
      }
    } else {
      // 登录逻辑
      try {
        setLoading(true);
        await login({
          username: username,
          password: password,
        });
        onLogin();
      } catch (err: any) {
        setError(err.message || '登录失败');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-bg">
        <div className="login-bg-shape shape-1"></div>
        <div className="login-bg-shape shape-2"></div>
        <div className="login-bg-shape shape-3"></div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <span className="login-logo-text">FinChat</span>
          </div>
          <p className="login-subtitle">智能解析公告事件，挖掘产业链投资机会</p>
        </div>

        <div className="login-tabs">
          <button 
            className={`login-tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            登录
          </button>
          <button 
            className={`login-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            注册
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div style={{
              padding: '10px',
              background: '#fff2f0',
              border: '1px solid #ffccc7',
              borderRadius: '4px',
              color: '#cf1322',
              marginBottom: '15px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">用户名</label>
            <input
              type="text"
              className="form-input"
              placeholder="请输入用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">昵称（可选）</label>
              <input
                type="text"
                className="form-input"
                placeholder="请输入昵称"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">密码</label>
            <input
              type="password"
              className="form-input"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">确认密码</label>
              <input
                type="password"
                className="form-input"
                placeholder="请再次输入密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          {isLogin && (
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>记住我</span>
              </label>
              <a href="#" className="forgot-password">忘记密码？</a>
            </div>
          )}

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
          </button>
        </form>

        {/* 微信登录 - 暂时注释 */}
        {/* <div className="login-divider">
          <span>或</span>
        </div>

        <div className="social-login">
          <button type="button" className="social-btn wechat">
            <span>微信登录</span>
          </button>
        </div> */}

        <p className="login-footer">
          登录即表示同意 <a href="#">用户协议</a> 和 <a href="#">隐私政策</a>
        </p>
      </div>
    </div>
  );
}

// 主页面组件
function MainPage() {
  const [inputValue, setInputValue] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false); // 移动端侧边栏默认关闭
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedType, setSelectedType] = useState<MessageType>('major_contract');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<Message | null>(null);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [loadingHistoryDetail, setLoadingHistoryDetail] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  // 保存用户提交时的输入信息，用于结果展示
  const [submittedInput, setSubmittedInput] = useState<{
    type: MessageType;
    content: string;
    fileName?: string;
  } | null>(null);

  const quickActions: Array<{ icon: string; label: string; type: MessageType }> = [
    { icon: '📄', label: '重大合同', type: 'major_contract' },
    { icon: '📜', label: '行业政策', type: 'industry_policy' },
    { icon: '📈', label: '业绩预告', type: 'earnings_forecast' },
    { icon: '💰', label: '产品提价', type: 'product_price_increase' },
  ];

  // 示例文本
  const exampleTexts: Record<string, string> = {
    major_contract: 'XX公司公告：公司与YY公司签订设备采购合同，合同总金额约12亿元人民币，履行期限为2026年12月前。若顺利执行将对公司未来经营业绩产生积极影响。',
    industry_policy: '《关于促进储能行业高质量发展的指导意见》：到2027年新型储能装机规模显著提升，支持电化学储能关键材料与装备国产化，鼓励电网侧、工商业侧储能示范应用；加强安全标准与准入管理，严控低质产能。',
    earnings_forecast: 'ZZ公司2025年度业绩预告：预计2025年归母净利润为8.0亿元-9.2亿元，同比增长45%-65%；扣非净利润为7.2亿元-8.5亿元，同比增长40%-60%。业绩增长主要由于核心产品销量提升、原材料成本下降以及费用率改善。',
    product_price_increase: 'AA公司通知：自2026年1月1日起，对部分工业级硅胶产品价格上调8%-12%。提价原因包括上游原料价格上涨、环保治理投入增加以及部分产能检修导致供给偏紧。',
  };

  // 点击快捷按钮
  const handleQuickAction = (type: MessageType) => {
    setSelectedType(type);
    setInputValue(exampleTexts[type] || '');
    setResult(null);
    setError('');
    setSelectedFile(null);
    setSelectedHistoryId(null);
  };

  // 加载历史列表
  const fetchHistory = async () => {
    setHistoryLoading(true);
    setHistoryError('');
    try {
      const data = await getHistoryList({ pageNumber: 1, pageSize: 50 });
      setHistory(data.items || []);
    } catch (err: any) {
      setHistoryError(err.message || '获取历史记录失败');
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredHistory = history.filter((item) => {
    if (!searchKeyword.trim()) return true;
    const keyword = searchKeyword.trim().toLowerCase();
    return (
      (item.title && item.title.toLowerCase().includes(keyword)) ||
      (item.type && item.type.toLowerCase().includes(keyword))
    );
  });

  // 文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 检查文件类型
      const allowedTypes = ['.pdf', '.docx', '.doc', '.txt'];
      const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!allowedTypes.includes(fileExt)) {
        setError(`不支持的文件格式，仅支持: ${allowedTypes.join(', ')}`);
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const buildTitle = () => {
    if (selectedFile?.name) return selectedFile.name;
    if (inputValue.trim()) return inputValue.trim().slice(0, 30);
    const quick = quickActions.find((action) => action.type === selectedType);
    return quick ? quick.label : '新对话';
  };

  const handleHistorySelect = async (id: string) => {
    setSelectedHistoryId(id);
    setLoadingHistoryDetail(true);
    setError('');
    setResult(null);
    setSubmittedInput(null);
    try {
      const detail = await getMessageDetail(id);
      setResult(detail);
      setSubmittedInput({
        type: detail.type,
        content: detail.content,
      });
      setSelectedType(detail.type);
    } catch (err: any) {
      setError(err.message || '加载历史记录失败');
    } finally {
      setLoadingHistoryDetail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile && !inputValue.trim()) {
      setError('请输入文本或上传文件');
      return;
    }

    // 保存用户提交的输入信息
    setSubmittedInput({
      type: selectedType,
      content: selectedFile ? '' : inputValue,
      fileName: selectedFile?.name,
    });

    setAnalyzing(true);
    setError('');
    setResult(null);
    setSelectedHistoryId(null);

    try {
      let response: Message;
      const title = buildTitle();

      if (selectedFile) {
        // 文件上传模式
        response = await sendMessageWithFile(selectedFile, selectedType, title);
      } else {
        // 文本输入模式
        response = await sendMessage({
          content: inputValue,
          type: selectedType,
          title,
        });
      }

      setResult(response);
      setInputValue('');
      setSelectedFile(null);
      setSelectedHistoryId(response.id);
      fetchHistory();
    } catch (err: any) {
      setError(err.message || '分析失败，请稍后重试');
    } finally {
      setAnalyzing(false);
    }
  };

  // 移动端打开侧边栏
  const openMobileSidebar = () => {
    setSidebarOpen(true);
    setSidebarCollapsed(false);
  };

  // 移动端关闭侧边栏
  const closeMobileSidebar = () => {
    setSidebarOpen(false);
  };

  // 桌面端切换收缩
  const toggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // 登出功能
  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      // 清除 Token
      localStorage.removeItem('finchat_access_token');
      // 刷新页面回到登录页
      window.location.reload();
    }
  };

  return (
    <div className={`app-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* 移动端遮罩 */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={closeMobileSidebar}
      />

      {/* 侧边栏 */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-text">FinChat</span>
            <span className="version">v1.0</span>
          </div>
          <button 
            className="collapse-btn desktop-only"
            onClick={toggleCollapse}
            title={sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
          <button 
            className="close-sidebar-btn mobile-only"
            onClick={closeMobileSidebar}
          >
            ✕
          </button>
        </div>
        
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="搜索对话..."
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              setSelectedHistoryId(null);
            }}
          />
        </div>

        <div className="chat-list">
          {historyLoading && <p className="empty-state">加载中...</p>}
          {historyError && !historyLoading && <p className="empty-state">{historyError}</p>}
          {!historyLoading && !historyError && history.length === 0 && (
            <p className="empty-state">暂无对话</p>
          )}
          {!historyLoading && filteredHistory.length === 0 && history.length > 0 && (
            <p className="empty-state">无匹配结果</p>
          )}
          {!historyLoading && filteredHistory.map((item) => {
            const action = quickActions.find((q) => q.type === item.type);
            const tag = action ? `${action.icon} ${action.label}` : item.type;
            const time = item.createdAt ? new Date(item.createdAt).toLocaleString() : '';
            return (
              <button
                key={item.id}
                className={`chat-item ${selectedHistoryId === item.id ? 'active' : ''}`}
                onClick={() => handleHistorySelect(item.id)}
              >
                <div className="chat-item-title">{item.title || '新对话'}</div>
                <div className="chat-item-meta">
                  <span className="chat-item-tag">{tag}</span>
                  <span className="chat-item-time">{time}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">U</div>
            <span className="username">用户</span>
            <button
              className="logout-btn"
              onClick={handleLogout}
              title="退出登录"
            >
              退出
            </button>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="main-content">
        {/* 顶部导航栏 */}
        <header className="top-nav">
          <div className="nav-left">
            <button 
              className="menu-btn mobile-only"
              onClick={openMobileSidebar}
            >
              ☰
            </button>
            <button 
              className="collapse-nav-btn desktop-only"
              onClick={toggleCollapse}
              title={sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
            >
              {sidebarCollapsed ? '☰' : '◀'}
            </button>
            <div className="nav-logo">
              <span className="logo-text">FinChat</span>
            </div>
          </div>
        </header>

        {/* 欢迎区域 */}
        <div className="welcome-section">
          {!result && (
            <div className="welcome-content">
              <h1 className="greeting">
                你好，
                <br />
                请粘贴需要分析的<span className="highlight">公告或新闻</span>
              </h1>
            </div>
          )}
          {loadingHistoryDetail && (
            <div style={{ margin: '10px auto', padding: '10px 14px', background: '#f0f5ff', borderRadius: '8px', color: '#2f54eb', maxWidth: '560px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              正在加载历史记录...
            </div>
          )}

          {/* 分析结果展示 */}
          {result && (
            <div className="analysis-result" style={{
              padding: '20px',
              maxWidth: '900px',
              margin: '0 auto',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>📊 分析结果</h2>

              {/* 用户输入信息展示 */}
              {submittedInput && (
                <div style={{
                  marginBottom: '20px',
                  padding: '12px 15px',
                  background: '#fafafa',
                  borderRadius: '8px',
                  border: '1px solid #e8e8e8',
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '8px',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{
                      padding: '4px 10px',
                      background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      whiteSpace: 'nowrap'
                    }}>
                      {quickActions.find(a => a.type === submittedInput.type)?.icon} {quickActions.find(a => a.type === submittedInput.type)?.label || submittedInput.type}
                    </span>
                    <span style={{ fontSize: '12px', color: '#999' }}>分析类型</span>
                  </div>
                  {submittedInput.fileName ? (
                    <div className="submitted-file-name">
                      <span>📎</span>
                      <strong>上传文件：</strong>
                      <span className="submitted-file-text">{submittedInput.fileName}</span>
                    </div>
                  ) : (
                    <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.6', width: '100%' }}>
                      <strong style={{ color: '#333' }}>用户问题：</strong>
                      <span style={{
                        display: 'block',
                        marginTop: '6px',
                        padding: '8px 10px',
                        background: 'white',
                        borderRadius: '4px',
                        border: '1px solid #eee',
                        maxHeight: '80px',
                        overflow: 'auto',
                        wordBreak: 'break-word'
                      }}>
                        {submittedInput.content}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* 核心解读 */}
              <div style={{ marginBottom: '25px', padding: '15px', background: '#f6ffed', borderRadius: '8px', border: '1px solid #b7eb8f' }}>
                <h3 style={{ marginBottom: '10px', color: '#52c41a' }}>💡 核心解读</h3>
                <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '10px' }}>{result.response.interpretation.core_content}</p>
                <div style={{ display: 'flex', gap: '15px', fontSize: '14px' }}>
                  <span>情绪: <strong>{result.response.interpretation.sentiment}</strong></span>
                  <span>置信度: <strong>{result.response.interpretation.confidence}%</strong></span>
                </div>
              </div>

              {/* 传导链路 */}
              <div style={{ marginBottom: '25px', padding: '15px', background: '#e6f7ff', borderRadius: '8px', border: '1px solid #91d5ff' }}>
                <h3 style={{ marginBottom: '15px', color: '#1890ff' }}>🔗 传导链路</h3>
                <PathChain pathText={result.response.path_text} />
              </div>

              {/* 风险提示 */}
              <div style={{ marginBottom: '25px', padding: '15px', background: '#fff7e6', borderRadius: '8px', border: '1px solid #ffd591' }}>
                <h3 style={{ marginBottom: '10px', color: '#fa8c16' }}>⚠️ 风险提示</h3>
                <ul style={{ margin: '0', paddingLeft: '20px' }}>
                  {result.response.risks.map((risk, index) => (
                    <li key={index} style={{ marginBottom: '5px' }}>{risk}</li>
                  ))}
                </ul>
                <p style={{ marginTop: '10px', fontSize: '13px', color: '#666' }}>
                  <strong>一般风险:</strong> {result.response.general_risks.join('、')}
                </p>
              </div>

              {/* 提取的事实 */}
              <div style={{ marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '15px', color: '#666' }}>📋 提取的事实</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {Object.entries(result.response.extracted_facts).map(([key, value]) => {
                    // 特殊处理 source_quotes
                    if (key === 'source_quotes' && Array.isArray(value)) {
                      return (
                        <div key={key} style={{
                          display: 'flex',
                          flexDirection: 'column',
                          padding: '12px',
                          background: 'white',
                          borderRadius: '6px',
                          border: '1px solid #e0e0e0'
                        }}>
                          <span style={{
                            fontSize: '12px',
                            color: '#999',
                            marginBottom: '10px',
                            fontWeight: '500'
                          }}>
                            {formatFieldName(key)}
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {value.map((item: any, idx: number) => (
                              <div key={idx} style={{
                                padding: '10px 12px',
                                background: '#fafafa',
                                borderRadius: '6px',
                                borderLeft: '3px solid #1890ff'
                              }}>
                                {item.quote && (
                                  <div style={{ marginBottom: '8px' }}>
                                    <div style={{
                                      fontSize: '11px',
                                      color: '#999',
                                      marginBottom: '4px',
                                      fontWeight: '500'
                                    }}>
                                      📄 原文引用
                                    </div>
                                    <div style={{
                                      fontSize: '13px',
                                      color: '#333',
                                      lineHeight: '1.6',
                                      fontStyle: 'italic'
                                    }}>
                                      "{item.quote}"
                                    </div>
                                  </div>
                                )}
                                {item.why && (
                                  <div>
                                    <div style={{
                                      fontSize: '11px',
                                      color: '#999',
                                      marginBottom: '4px',
                                      fontWeight: '500'
                                    }}>
                                      💡 支持理由
                                    </div>
                                    <div style={{
                                      fontSize: '13px',
                                      color: '#666',
                                      lineHeight: '1.6'
                                    }}>
                                      {item.why}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    // 处理其他复杂对象
                    if (typeof value === 'object' && value !== null) {
                      if (Array.isArray(value)) {
                        // 处理普通数组类型
                        return (
                          <div key={key} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '10px',
                            background: 'white',
                            borderRadius: '6px',
                            border: '1px solid #e0e0e0'
                          }}>
                            <span style={{
                              fontSize: '12px',
                              color: '#999',
                              marginBottom: '6px',
                              fontWeight: '500'
                            }}>
                              {formatFieldName(key)}
                            </span>
                            <ul style={{
                              margin: 0,
                              paddingLeft: '20px',
                              fontSize: '14px',
                              color: '#333'
                            }}>
                              {value.map((item, idx) => (
                                <li key={idx} style={{ marginBottom: '4px' }}>
                                  {typeof item === 'object' ? JSON.stringify(item) : String(item)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      }
                      // 跳过其他复杂对象
                      return null;
                    }

                    // 处理简单值
                    return (
                      <div key={key} style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        padding: '10px',
                        background: 'white',
                        borderRadius: '6px',
                        border: '1px solid #e0e0e0'
                      }}>
                        <span style={{
                          fontSize: '12px',
                          color: '#999',
                          minWidth: '120px',
                          fontWeight: '500'
                        }}>
                          {formatFieldName(key)}:
                        </span>
                        <span style={{
                          fontSize: '14px',
                          color: '#333',
                          fontWeight: '600',
                          flex: 1
                        }}>
                          {value === null ? '未提供' : String(value)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 免责声明 */}
              <div style={{ fontSize: '12px', color: '#999', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                <p style={{ marginBottom: '5px' }}>{result.response.disclaimer}</p>
                <p>追踪ID: {result.response.trace_id} | 耗时: {result.response.latency_ms}ms</p>
              </div>

              {/* 重新分析按钮 */}
              <button
                onClick={() => {
                  setResult(null);
                  setInputValue('');
                  setSubmittedInput(null);
                }}
                style={{
                  marginTop: '15px',
                  padding: '10px 20px',
                  background: '#1890ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                重新分析
              </button>
            </div>
          )}

          {/* 底部区域（移动端固定在底部） */}
          <div className="bottom-section">
            {/* 快捷操作按钮 */}
            <div className="quick-actions">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className={`action-btn ${selectedType === action.type ? 'active' : ''}`}
                  onClick={() => handleQuickAction(action.type)}
                  disabled={analyzing}
                >
                  <span className="action-icon">{action.icon}</span>
                  <span className="action-label">{action.label}</span>
                </button>
              ))}
            </div>

            {/* Loading 提示 */}
            {analyzing && (
              <div style={{
                padding: '16px',
                background: 'linear-gradient(135deg, #e6f7ff 0%, #f0f5ff 100%)',
                border: '1px solid #91d5ff',
                borderRadius: '10px',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  border: '3px solid #e6f7ff',
                  borderTop: '3px solid #1890ff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  flexShrink: 0
                }} />
                <div style={{
                  flex: 1,
                  minWidth: 0,
                  overflow: 'hidden'
                }}>
                  <div style={{
                    fontSize: '14px',
                    color: '#1890ff',
                    fontWeight: '600',
                    marginBottom: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    🔍 正在分析中...
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#666',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    AI 正在解析您的{submittedInput?.fileName ? '文件' : '文本'}，分析传导链路和风险因素
                  </div>
                </div>
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            )}

            {/* 错误提示 */}
            {error && (
              <div style={{
                padding: '12px',
                background: '#fff2f0',
                border: '1px solid #ffccc7',
                borderRadius: '8px',
                color: '#cf1322',
                marginBottom: '15px',
                fontSize: '14px',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
                wordBreak: 'break-word'
              }}>
                ❌ {error}
              </div>
            )}

            {/* 输入区域 */}
            <form className="input-section" onSubmit={handleSubmit}>
              <div className="input-wrapper">
                {selectedFile && (
                  <div className="file-chip">
                    <span className="file-chip-name">📎 {selectedFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="file-chip-remove"
                    >
                      ✕
                    </button>
                  </div>
                )}
                {!selectedFile && (
                  <textarea
                    className="chat-input"
                    placeholder="粘贴公告或新闻全文，或上传文件（支持PDF/Word/TXT）..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    rows={3}
                    disabled={analyzing}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                )}
                <div className="input-actions">
                  <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".pdf,.docx,.doc,.txt"
                      onChange={handleFileSelect}
                      disabled={analyzing}
                      style={{ display: 'none' }}
                    />
                    <button type="button" className="add-btn" disabled={analyzing} onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('file-upload')?.click();
                    }}>
                      📎
                    </button>
                  </label>
                  <span className="quick-reply">
                    <span className="lightning">⚡</span>
                    {analyzing ? '分析中...' : '开始传导分析'}
                  </span>
                </div>
                <div className="submit-actions">
                  <button type="button" className="voice-btn" disabled={analyzing}>🎤</button>
                  <button type="submit" className="send-btn" disabled={analyzing}>
                    <span>{analyzing ? '⏳' : '↑'}</span>
                  </button>
                </div>
              </div>
            </form>

            {/* 免责声明 */}
            <p className="disclaimer">
              当前支持：①公司重大合同 ②行业政策。分析结果由AI生成，仅供参考，不构成投资建议。
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return <MainPage />;
}

export default App;
