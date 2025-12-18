/**
 * API 使用示例
 * 这个文件展示了如何使用各个 API 服务
 */

import { useState } from 'react';
import {
  login,
  register,
  sendVerificationCode,
  getCurrentUser,
  createConversation,
  getConversations,
  generateMessage,
  uploadFile,
} from '../services';

/**
 * 认证示例
 */
export const AuthExample = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');

  // 发送验证码
  const handleSendCode = async () => {
    try {
      await sendVerificationCode({
        emailAddress: email,
        scope: 'SIGN_UP',
      });
      alert('验证码已发送');
    } catch (error) {
      console.error('发送失败:', error);
    }
  };

  // 注册
  const handleRegister = async () => {
    try {
      await register({
        emailAddress: email,
        verificationCode: code,
        password: password,
        nickname: '新用户',
      });
      alert('注册成功');
    } catch (error) {
      console.error('注册失败:', error);
    }
  };

  // 登录
  const handleLogin = async () => {
    try {
      await login({
        username: email,
        password: password,
      });
      
      // 获取用户信息
      const userInfo = await getCurrentUser();
      console.log('用户信息:', userInfo.data);
      alert('登录成功');
    } catch (error) {
      console.error('登录失败:', error);
    }
  };

  return (
    <div>
      <h2>认证示例</h2>
      <input
        type="email"
        placeholder="邮箱"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="验证码"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <input
        type="password"
        placeholder="密码"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSendCode}>发送验证码</button>
      <button onClick={handleRegister}>注册</button>
      <button onClick={handleLogin}>登录</button>
    </div>
  );
};

/**
 * 对话和消息示例
 */
export const ChatExample = () => {
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 创建新对话
  const handleCreateConversation = async () => {
    try {
      const response = await createConversation({
        title: '新对话',
        type: 'general',
      });
      setConversationId(response.data.id);
      alert(`对话创建成功，ID: ${response.data.id}`);
    } catch (error) {
      console.error('创建失败:', error);
    }
  };

  // 获取对话列表
  const handleGetConversations = async () => {
    try {
      const response = await getConversations();
      console.log('对话列表:', response.data);
    } catch (error) {
      console.error('获取失败:', error);
    }
  };

  // 发送消息（流式响应）
  const handleSendMessage = async () => {
    if (!conversationId) {
      alert('请先创建对话');
      return;
    }

    setIsLoading(true);
    setAiResponse('');

    try {
      await generateMessage(
        {
          conversationId: conversationId,
          content: message,
          mode: 'standard',
          persistFlag: 1,
        },
        // 接收消息片段
        (chunk: string) => {
          setAiResponse((prev) => prev + chunk);
        },
        // 完成回调
        () => {
          console.log('消息生成完成');
          setIsLoading(false);
        },
        // 错误回调
        (error: Error) => {
          console.error('生成失败:', error);
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error('请求失败:', error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>对话示例</h2>
      <button onClick={handleCreateConversation}>创建对话</button>
      <button onClick={handleGetConversations}>获取对话列表</button>
      
      {conversationId && (
        <div>
          <p>当前对话 ID: {conversationId}</p>
          <input
            type="text"
            placeholder="输入消息"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleSendMessage} disabled={isLoading}>
            {isLoading ? '生成中...' : '发送'}
          </button>
          
          {aiResponse && (
            <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
              <h3>AI 回复：</h3>
              <p>{aiResponse}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * 文件上传示例
 */
export const FileUploadExample = () => {
  const [uploadedFile, setUploadedFile] = useState<any>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const response = await uploadFile(file);
      setUploadedFile(response.data);
      console.log('文件上传成功:', response.data);
      alert('上传成功');
    } catch (error) {
      console.error('上传失败:', error);
    }
  };

  return (
    <div>
      <h2>文件上传示例</h2>
      <input type="file" onChange={handleFileChange} />
      
      {uploadedFile && (
        <div>
          <p>文件名: {uploadedFile.fileName}</p>
          <p>文件大小: {(uploadedFile.fileSize / 1024).toFixed(2)} KB</p>
          <p>文件 URL: <a href={uploadedFile.url} target="_blank">{uploadedFile.url}</a></p>
        </div>
      )}
    </div>
  );
};

