'use client';

import { useState, useEffect, useCallback } from 'react';

// ===== 类型定义 =====
interface User {
  id: string;
  username: string;
}

interface CharacterAttributes {
  intelligence: number;
  charisma: number;
  resilience: number;
  ethics: number;
  ambition: number;
  luck: number;
  financialAcumen: number;
  technicalSkill: number;
  networkStrength: number;
  leadership: number;
  compliance: number;
  health: number;
  mentalHealth: number;
  reputation: number;
  wealth: number;
  stress: number;
  position: string;
  company: string;
  experience: number;
  achievements: string[];
  failures: string[];
}

interface GameEvent {
  id: string;
  day: number;
  category: string;
  title: string;
  description: string;
  aiDecision: string;
  consequence: string;
  attributeChanges: Record<string, number>;
  timestamp: number;
}

interface GameCharacter {
  id: string;
  userId: string;
  name: string;
  personality: string;
  skills: string[];
  careerDirection: string;
  background: string;
  attributes: CharacterAttributes;
  currentDay: number;
  isAlive: boolean;
  events: GameEvent[];
  lastSimulated: number;
  createdAt: number;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  position: string;
  company: string;
  wealth: number;
  reputation: number;
  day: number;
  achievements: number;
  isAlive: boolean;
}

// ===== API 工具 =====
const API_BASE = '/api';

async function apiCall(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('game_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || '请求失败');
  }
  return data;
}

// ===== 属性显示配置 =====
const ATTRIBUTE_CONFIG: { key: keyof CharacterAttributes; label: string; color: string; icon: string }[] = [
  { key: 'intelligence', label: '智慧', color: '#8B5CF6', icon: '🧠' },
  { key: 'charisma', label: '魅力', color: '#EC4899', icon: '✨' },
  { key: 'resilience', label: '韧性', color: '#F59E0B', icon: '🛡️' },
  { key: 'ethics', label: '道德', color: '#10B981', icon: '⚖️' },
  { key: 'ambition', label: '野心', color: '#EF4444', icon: '🔥' },
  { key: 'luck', label: '运气', color: '#6366F1', icon: '🍀' },
  { key: 'financialAcumen', label: '金融敏锐度', color: '#14B8A6', icon: '📊' },
  { key: 'technicalSkill', label: '技术能力', color: '#3B82F6', icon: '💻' },
  { key: 'networkStrength', label: '人脉网络', color: '#F97316', icon: '🤝' },
  { key: 'leadership', label: '领导力', color: '#8B5CF6', icon: '👑' },
  { key: 'compliance', label: '合规意识', color: '#06B6D4', icon: '📋' },
  { key: 'health', label: '身体健康', color: '#22C55E', icon: '💪' },
  { key: 'mentalHealth', label: '心理健康', color: '#A855F7', icon: '🧘' },
  { key: 'reputation', label: '行业声誉', color: '#EAB308', icon: '⭐' },
  { key: 'wealth', label: '个人财富(万)', color: '#F59E0B', icon: '💰' },
  { key: 'stress', label: '压力值', color: '#EF4444', icon: '😰' },
];

// ===== 主组件 =====
export default function GamePage() {
  const [user, setUser] = useState<User | null>(null);
  const [character, setCharacter] = useState<GameCharacter | null>(null);
  const [characters, setCharacters] = useState<GameCharacter[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [gameStats, setGameStats] = useState({ totalUsers: 0, totalCharacters: 0, aliveCharacters: 0 });
  const [page, setPage] = useState<'auth' | 'create' | 'game' | 'leaderboard'>('auth');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [error, setError] = useState('');
  const [autoSim, setAutoSim] = useState(false);
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [showAllAttrs, setShowAllAttrs] = useState(false);

  // 认证表单
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  
  // 角色创建表单
  const [charForm, setCharForm] = useState({
    name: '',
    personality: '',
    skills: '',
    careerDirection: '',
    background: '',
  });

  // 加载游戏数据
  const loadGameData = useCallback(async () => {
    try {
      const data = await apiCall('/game/status');
      setCharacter(data.character);
      setCharacters(data.characters || []);
      
      // 加载排行榜
      const lbData = await apiCall('/game/leaderboard');
      setLeaderboard(lbData.leaderboard || []);
      setGameStats(lbData.stats || { totalUsers: 0, totalCharacters: 0, aliveCharacters: 0 });
    } catch (err) {
      console.error('Load game data error:', err);
    }
  }, []);

  // 检查登录状态
  useEffect(() => {
    const token = localStorage.getItem('game_token');
    const savedUser = localStorage.getItem('game_user');
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Defer state updates to avoid synchronous setState in effect
        setTimeout(() => {
          setUser(parsedUser);
          setPage('game');
          loadGameData();
        }, 0);
      } catch {
        localStorage.removeItem('game_token');
        localStorage.removeItem('game_user');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 模拟
  const handleSimulate = async (days: number) => {
    if (!character || simulating) return;
    setSimulating(true);
    
    try {
      const data = await apiCall('/game/simulate', {
        method: 'POST',
        body: JSON.stringify({ characterId: character.id, days }),
      });
      
      if (data.success) {
        setCharacter(data.character);
      }
    } catch (err) {
      console.error('Simulate error:', err);
    } finally {
      setSimulating(false);
    }
  };

  // 自动模拟
  useEffect(() => {
    if (!autoSim || !character?.isAlive) return;
    
    const interval = setInterval(async () => {
      await handleSimulate(1);
    }, 8000);
    
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSim, character?.isAlive, character?.id]);

  // 认证操作
  const handleAuth = async (isLoginAction: boolean) => {
    setLoading(true);
    setError('');
    
    try {
      const endpoint = isLoginAction ? '/auth/login' : '/auth/register';
      const data = await apiCall(endpoint, {
        method: 'POST',
        body: JSON.stringify(authForm),
      });
      
      if (data.success) {
        localStorage.setItem('game_token', data.token);
        localStorage.setItem('game_user', JSON.stringify(data.user));
        setUser(data.user);
        
        if (isLoginAction) {
          setPage('game');
          loadGameData();
        } else {
          setPage('create');
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '操作失败');
    } finally {
      setLoading(false);
    }
  };

  // 创建角色
  const handleCreateCharacter = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await apiCall('/game/create-character', {
        method: 'POST',
        body: JSON.stringify({
          ...charForm,
          skills: charForm.skills.split(/[,，、]/).map(s => s.trim()).filter(Boolean),
        }),
      });
      
      if (data.success) {
        setCharacter(data.character);
        setPage('game');
        loadGameData();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '创建失败');
    } finally {
      setLoading(false);
    }
  };

  // 登出
  const handleLogout = () => {
    localStorage.removeItem('game_token');
    localStorage.removeItem('game_user');
    setUser(null);
    setCharacter(null);
    setPage('auth');
    setAutoSim(false);
  };

  // 切换角色
  const handleSwitchCharacter = async (charId: string) => {
    try {
      const data = await apiCall(`/game/status?characterId=${charId}`);
      if (data.character) {
        setCharacter(data.character);
      }
    } catch (err) {
      console.error('Switch character error:', err);
    }
  };

  // 过滤事件
  const filteredEvents = character?.events
    ? [...character.events]
        .filter(e => eventFilter === 'all' || e.category === eventFilter)
        .reverse()
        .slice(0, 50)
    : [];

  // ===== 渲染：认证页面 =====
  const renderAuth = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg shadow-blue-500/25">
            <span className="text-4xl">🏦</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
            金融职场生存者
          </h1>
          <p className="text-gray-400 mt-2">AI驱动的金融职场生存模拟</p>
        </div>
        
        {/* 表单 */}
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-800 p-8 shadow-2xl">
          <div className="flex mb-6 bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isLogin ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              登录
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                !isLogin ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              注册
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">用户名</label>
              <input
                type="text"
                value={authForm.username}
                onChange={e => setAuthForm({ ...authForm, username: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="输入用户名"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">密码</label>
              <input
                type="password"
                value={authForm.password}
                onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="输入密码"
                onKeyDown={e => e.key === 'Enter' && handleAuth(isLogin)}
              />
            </div>
            
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <button
              onClick={() => handleAuth(isLogin)}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
            >
              {loading ? '处理中...' : isLogin ? '登录' : '注册'}
            </button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="text-center text-gray-500 text-xs">
              <p>创建你的数字人，在金融世界中生存与发展</p>
              <p className="mt-1">10000+ 场景 | AI驱动 | 多人在线</p>
            </div>
          </div>
        </div>
        
        {/* 游戏统计 */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="bg-gray-900/60 backdrop-blur rounded-xl p-3 text-center border border-gray-800">
            <div className="text-2xl font-bold text-blue-400">{gameStats.totalUsers}</div>
            <div className="text-xs text-gray-500">注册玩家</div>
          </div>
          <div className="bg-gray-900/60 backdrop-blur rounded-xl p-3 text-center border border-gray-800">
            <div className="text-2xl font-bold text-purple-400">{gameStats.totalCharacters}</div>
            <div className="text-xs text-gray-500">数字人</div>
          </div>
          <div className="bg-gray-900/60 backdrop-blur rounded-xl p-3 text-center border border-gray-800">
            <div className="text-2xl font-bold text-emerald-400">{gameStats.aliveCharacters}</div>
            <div className="text-xs text-gray-500">存活中</div>
          </div>
        </div>
      </div>
    </div>
  );

  // ===== 渲染：角色创建页面 =====
  const renderCreateCharacter = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">创建你的数字人</h1>
          <p className="text-gray-400">用自然语言描述你的角色，AI将据此操控其在金融世界中生存</p>
        </div>
        
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-800 p-8 shadow-2xl">
          <div className="space-y-6">
            {/* 姓名 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <span className="text-blue-400">01</span> 角色姓名
              </label>
              <input
                type="text"
                value={charForm.name}
                onChange={e => setCharForm({ ...charForm, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="给你的数字人取一个名字"
              />
            </div>
            
            {/* 品格 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <span className="text-purple-400">02</span> 品格描述
              </label>
              <textarea
                value={charForm.personality}
                onChange={e => setCharForm({ ...charForm, personality: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all h-24 resize-none"
                placeholder="用自然语言描述角色的品格特质，例如：性格果断但谨慎，善于交际但内心孤独，有强烈的正义感但也懂得变通..."
              />
            </div>
            
            {/* 技能 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <span className="text-emerald-400">03</span> 专业技能
              </label>
              <input
                type="text"
                value={charForm.skills}
                onChange={e => setCharForm({ ...charForm, skills: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="用逗号分隔，例如：财务建模、风险评估、量化交易、Python编程"
              />
            </div>
            
            {/* 职业方向 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <span className="text-amber-400">04</span> 职业发展方向
              </label>
              <input
                type="text"
                value={charForm.careerDirection}
                onChange={e => setCharForm({ ...charForm, careerDirection: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                placeholder="例如：投资银行、量化交易、基金管理、金融科技..."
              />
            </div>
            
            {/* 背景 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <span className="text-cyan-400">05</span> 背景故事 <span className="text-gray-500">(可选)</span>
              </label>
              <textarea
                value={charForm.background}
                onChange={e => setCharForm({ ...charForm, background: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all h-24 resize-none"
                placeholder="描述角色的背景故事，例如：名校金融系毕业，曾在华尔街实习，家族三代从事金融行业..."
              />
            </div>
            
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <div className="flex gap-4">
              <button
                onClick={() => setPage('game')}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl transition-all border border-gray-700"
              >
                跳过
              </button>
              <button
                onClick={handleCreateCharacter}
                disabled={loading || !charForm.name || !charForm.personality || !charForm.careerDirection}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
              >
                {loading ? '创建中...' : '创建数字人'}
              </button>
            </div>
          </div>
        </div>
        
        {/* 提示 */}
        <div className="mt-6 bg-gray-900/60 backdrop-blur rounded-xl p-4 border border-gray-800">
          <h3 className="text-sm font-medium text-gray-300 mb-2">💡 创建提示</h3>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• 品格描述越详细，AI操控的数字人行为越符合你的预期</li>
            <li>• 专业技能会影响角色在不同场景中的表现</li>
            <li>• 职业方向决定了角色的初始属性和起点</li>
            <li>• 创建后角色将自动在AI操控下生存发展，你只需观看</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // ===== 渲染：属性条 =====
  const renderAttrBar = (key: keyof CharacterAttributes, label: string, color: string, icon: string, value: number) => {
    const isWealth = key === 'wealth';
    const isStress = key === 'stress';
    const maxVal = isWealth ? Math.max(200, value + 100) : 100;
    const percentage = isWealth ? Math.min(100, (value / maxVal) * 100) : value;
    const barColor = isStress ? (value > 70 ? '#EF4444' : value > 40 ? '#F59E0B' : '#22C55E') : color;
    
    return (
      <div key={key} className="flex items-center gap-3 py-1.5">
        <span className="text-sm w-5 text-center">{icon}</span>
        <span className="text-xs text-gray-400 w-20 truncate">{label}</span>
        <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${percentage}%`, backgroundColor: barColor }}
          />
        </div>
        <span className="text-xs font-mono text-gray-300 w-12 text-right">
          {isWealth ? `${value}万` : value}
        </span>
      </div>
    );
  };

  // ===== 渲染：游戏主界面 =====
  const renderGame = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* 顶部导航 */}
      <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏦</span>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              金融职场生存者
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage('leaderboard')}
              className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 text-gray-300 transition-all"
            >
              🏆 排行榜
            </button>
            <button
              onClick={() => setPage('create')}
              className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 text-gray-300 transition-all"
            >
              + 新角色
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg border border-gray-700">
              <span className="text-sm text-gray-400">{user?.username}</span>
              <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300">退出</button>
            </div>
          </div>
        </div>
      </nav>
      
      {!character ? (
        // 无角色 - 引导创建
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">🎭</div>
            <h2 className="text-2xl font-bold text-white mb-2">还没有数字人</h2>
            <p className="text-gray-400 mb-6">创建你的数字人，开始金融职场生存之旅</p>
            <button
              onClick={() => setPage('create')}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/25"
            >
              创建数字人
            </button>
          </div>
        </div>
      ) : (
        // 有角色 - 游戏界面
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* 角色选择 */}
          {characters.length > 1 && (
            <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
              {characters.map(c => (
                <button
                  key={c.id}
                  onClick={() => handleSwitchCharacter(c.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    c.id === character.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                  } ${!c.isAlive ? 'opacity-50' : ''}`}
                >
                  {c.name} - {c.attributes.position}
                  {!c.isAlive && ' 💀'}
                </button>
              ))}
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：角色信息 */}
            <div className="lg:col-span-1 space-y-4">
              {/* 角色卡片 */}
              <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-800 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg">
                    {character.isAlive ? '🧑‍💼' : '💀'}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{character.name}</h2>
                    <p className="text-sm text-gray-400">{character.attributes.position} @ {character.attributes.company}</p>
                    <p className="text-xs text-gray-500">第 {character.currentDay} 天 | {character.attributes.experience}年经验</p>
                  </div>
                </div>
                
                {!character.isAlive && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-red-400 text-sm font-medium">💀 角色已退出职场</p>
                    {character.attributes.failures.length > 0 && (
                      <p className="text-red-300 text-xs mt-1">{character.attributes.failures[character.attributes.failures.length - 1]}</p>
                    )}
                  </div>
                )}
                
                {/* 状态指示器 */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-gray-800 rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-amber-400">{character.attributes.wealth}万</div>
                    <div className="text-xs text-gray-500">财富</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-yellow-400">{character.attributes.reputation}</div>
                    <div className="text-xs text-gray-500">声誉</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-emerald-400">{character.attributes.achievements.length}</div>
                    <div className="text-xs text-gray-500">成就</div>
                  </div>
                </div>
                
                {/* 操作按钮 */}
                {character.isAlive && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSimulate(1)}
                        disabled={simulating}
                        className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50"
                      >
                        {simulating ? '⏳ 模拟中...' : '▶ 模拟1天'}
                      </button>
                      <button
                        onClick={() => handleSimulate(7)}
                        disabled={simulating}
                        className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50"
                      >
                        ⏩ 模拟7天
                      </button>
                    </div>
                    <button
                      onClick={() => setAutoSim(!autoSim)}
                      className={`w-full py-2.5 text-sm font-medium rounded-xl transition-all ${
                        autoSim
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
                      }`}
                    >
                      {autoSim ? '⏸ 停止自动模拟' : '🔄 开启自动模拟'}
                    </button>
                  </div>
                )}
              </div>
              
              {/* 属性面板 */}
              <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-300">角色属性</h3>
                  <button
                    onClick={() => setShowAllAttrs(!showAllAttrs)}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    {showAllAttrs ? '收起' : '展开全部'}
                  </button>
                </div>
                <div className="space-y-0.5">
                  {ATTRIBUTE_CONFIG
                    .filter((_, i) => showAllAttrs || i < 8)
                    .map(attr => renderAttrBar(attr.key, attr.label, attr.color, attr.icon, Number(character.attributes[attr.key]) || 0))
                  }
                </div>
              </div>
              
              {/* 成就 */}
              {character.attributes.achievements.length > 0 && (
                <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-800 p-6">
                  <h3 className="text-sm font-medium text-gray-300 mb-3">🏅 成就 ({character.attributes.achievements.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {character.attributes.achievements.slice(-20).map((ach, i) => (
                      <span key={i} className="px-2 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-400">
                        {ach}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* 右侧：事件流 */}
            <div className="lg:col-span-2 space-y-4">
              {/* 角色简介 */}
              <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-800 p-6">
                <h3 className="text-sm font-medium text-gray-300 mb-3">📋 角色设定</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">品格：</span>
                    <span className="text-gray-300">{character.personality}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">职业方向：</span>
                    <span className="text-gray-300">{character.careerDirection}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">技能：</span>
                    <span className="text-gray-300">{character.skills.join('、') || '无'}</span>
                  </div>
                  {character.background && (
                    <div className="sm:col-span-2">
                      <span className="text-gray-500">背景：</span>
                      <span className="text-gray-300">{character.background}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 事件流 */}
              <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-300">📜 职场日志</h3>
                  <div className="flex items-center gap-2">
                    <select
                      value={eventFilter}
                      onChange={e => setEventFilter(e.target.value)}
                      className="text-xs bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-gray-400 focus:outline-none"
                    >
                      <option value="all">全部场景</option>
                      <option value="日常办公">日常办公</option>
                      <option value="客户会议">客户会议</option>
                      <option value="危机处理">危机处理</option>
                      <option value="社交应酬">社交应酬</option>
                      <option value="内部竞争">内部竞争</option>
                      <option value="市场波动">市场波动</option>
                      <option value="职业抉择">职业抉择</option>
                      <option value="道德困境">道德困境</option>
                      <option value="投资决策">投资决策</option>
                      <option value="晋升考核">晋升考核</option>
                      <option value="风险事件">风险事件</option>
                    </select>
                    <span className="text-xs text-gray-500">{character.events.length} 条记录</span>
                  </div>
                </div>
                
                {filteredEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-3">📋</div>
                    <p className="text-gray-500">还没有职场日志，点击&ldquo;模拟1天&rdquo;开始</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredEvents.map(event => (
                      <div key={event.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 rounded text-xs text-blue-400">
                            {event.category}
                          </span>
                          <span className="text-xs text-gray-500">第{event.day}天</span>
                        </div>
                        
                        <p className="text-sm text-gray-300 mb-2">{event.description}</p>
                        
                        <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-3 mb-2">
                          <div className="text-xs text-purple-400 font-medium mb-1">🤖 AI决策</div>
                          <p className="text-sm text-gray-300">{event.aiDecision}</p>
                        </div>
                        
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                          <div className="text-xs text-emerald-400 font-medium mb-1">📊 结果</div>
                          <p className="text-sm text-gray-300">{event.consequence}</p>
                        </div>
                        
                        {/* 属性变化标签 */}
                        {Object.entries(event.attributeChanges).filter(([, v]) => Math.abs(v as number) > 2).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {Object.entries(event.attributeChanges)
                              .filter(([, v]) => Math.abs(v as number) > 2)
                              .map(([key, val]) => {
                                const config = ATTRIBUTE_CONFIG.find(a => a.key === key);
                                const isPositive = (val as number) > 0;
                                const isStress = key === 'stress';
                                const isGood = isStress ? !isPositive : isPositive;
                                return (
                                  <span
                                    key={key}
                                    className={`px-1.5 py-0.5 rounded text-xs ${
                                      isGood
                                        ? 'bg-emerald-500/10 text-emerald-400'
                                        : 'bg-red-500/10 text-red-400'
                                    }`}
                                  >
                                    {config?.icon} {config?.label} {isPositive ? '+' : ''}{val as number}
                                  </span>
                                );
                              })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ===== 渲染：排行榜 =====
  const renderLeaderboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setPage('game')} className="text-gray-400 hover:text-white transition-all">
              ← 返回
            </button>
            <h1 className="text-lg font-bold text-white">🏆 排行榜</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{gameStats.totalUsers} 玩家 | {gameStats.aliveCharacters} 存活</span>
          </div>
        </div>
      </nav>
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        {leaderboard.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-xl font-bold text-white mb-2">暂无排行数据</h2>
            <p className="text-gray-400">创建角色开始游戏后，排行榜将自动更新</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.id}
                className={`bg-gray-900/80 backdrop-blur-xl rounded-xl border p-4 flex items-center gap-4 transition-all ${
                  index < 3 ? 'border-amber-500/30' : 'border-gray-800'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                  index === 0 ? 'bg-amber-500/20 text-amber-400' :
                  index === 1 ? 'bg-gray-400/20 text-gray-300' :
                  index === 2 ? 'bg-orange-500/20 text-orange-400' :
                  'bg-gray-800 text-gray-500'
                }`}>
                  {index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{entry.name}</span>
                    {entry.isAlive ? (
                      <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded">存活</span>
                    ) : (
                      <span className="px-1.5 py-0.5 bg-red-500/10 text-red-400 text-xs rounded">淘汰</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{entry.position} @ {entry.company}</p>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-amber-400">{entry.wealth}万</div>
                    <div className="text-xs text-gray-500">财富</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-yellow-400">{entry.reputation}</div>
                    <div className="text-xs text-gray-500">声誉</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-blue-400">{entry.day}</div>
                    <div className="text-xs text-gray-500">天数</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-purple-400">{entry.achievements}</div>
                    <div className="text-xs text-gray-500">成就</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ===== 主渲染 =====
  return (
    <div className="min-h-screen">
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4B5563;
        }
      `}</style>
      
      {page === 'auth' && renderAuth()}
      {page === 'create' && renderCreateCharacter()}
      {page === 'game' && renderGame()}
      {page === 'leaderboard' && renderLeaderboard()}
    </div>
  );
}
