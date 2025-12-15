import { useState } from 'react';
import './index.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const quickActions = [
    { icon: '📊', label: '行情分析' },
    { icon: '📈', label: '股票推荐' },
    { icon: '💹', label: '技术指标' },
    { icon: '📰', label: '财经资讯' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      console.log('提交问题:', inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="app-container">
      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">💎</span>
            <span className="logo-text">FinChat</span>
            <span className="version">v1.0</span>
          </div>
          <button 
            className="close-sidebar-btn"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="搜索对话..." />
        </div>

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
          <button 
            className="menu-btn"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <div className="nav-logo">
            <span className="logo-icon">💎</span>
            <span className="logo-text">FinChat</span>
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
              今天有什么可以<span className="highlight">帮到</span>你？
            </h1>
          </div>

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
                placeholder="尽管提问..."
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
                  即刻回答
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
            AI分析仅供参考，不构成投资建议，请谨慎决策。
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
