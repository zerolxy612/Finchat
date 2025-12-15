import { useState } from 'react';
import './index.css';

// 登录页面组件
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verifyCode, setVerifyCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 模拟登录/注册
    onLogin();
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
            <span className="login-logo-icon">💎</span>
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
          <div className="form-group">
            <label className="form-label">手机号</label>
            <input
              type="tel"
              className="form-input"
              placeholder="请输入手机号"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">验证码</label>
              <div className="verify-code-wrapper">
                <input
                  type="text"
                  className="form-input"
                  placeholder="请输入验证码"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                />
                <button type="button" className="verify-code-btn">
                  获取验证码
                </button>
              </div>
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

          <button type="submit" className="login-submit-btn">
            {isLogin ? '登录' : '注册'}
          </button>
        </form>

        <div className="login-divider">
          <span>或</span>
        </div>

        <div className="social-login">
          <button type="button" className="social-btn wechat">
            <span>微信登录</span>
          </button>
        </div>

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const quickActions = [
    { icon: '📄', label: '重大合同' },
    { icon: '📜', label: '行业政策' },
    { icon: '📈', label: '业绩预告' },
    { icon: '💰', label: '产品提价' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      console.log('提交问题:', inputValue);
      setInputValue('');
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
            <span className="logo-icon">💎</span>
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
          <input type="text" placeholder="搜索对话..." />
        </div>

        <button className="new-chat-sidebar-btn">
          <span className="new-chat-icon">+</span>
          <span className="new-chat-text">新建对话</span>
        </button>

        <div className="chat-list">
          <p className="empty-state">暂无对话</p>
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">U</div>
            <span className="username">用户</span>
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
              <span className="logo-icon">💎</span>
              <span className="logo-text">FinChat</span>
            </div>
          </div>
          <button className="new-chat-btn">
            ✏️
          </button>
        </header>

        {/* 欢迎区域 */}
        <div className="welcome-section">
          <div className="welcome-content">
            <h1 className="greeting">
              你好，
              <br />
              请粘贴需要分析的<span className="highlight">公告或新闻</span>
            </h1>
          </div>

          {/* 底部区域（移动端固定在底部） */}
          <div className="bottom-section">
            {/* 快捷操作按钮 */}
            <div className="quick-actions">
              {quickActions.map((action, index) => (
                <button key={index} className="action-btn">
                  <span className="action-icon">{action.icon}</span>
                  <span className="action-label">{action.label}</span>
                </button>
              ))}
            </div>

            {/* 输入区域 */}
            <form className="input-section" onSubmit={handleSubmit}>
              <div className="input-wrapper">
                <textarea
                  className="chat-input"
                  placeholder="粘贴公告或新闻全文，例如：XX公司关于签订重大销售合同的公告..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <div className="input-actions">
                  <button type="button" className="add-btn">+</button>
                  <span className="quick-reply">
                    <span className="lightning">⚡</span>
                    开始传导分析
                  </span>
                </div>
                <div className="submit-actions">
                  <button type="button" className="voice-btn">🎤</button>
                  <button type="submit" className="send-btn">
                    <span>↑</span>
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
