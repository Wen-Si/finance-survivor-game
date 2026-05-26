// ==========================================
// 游戏数据存储 (内存 + 文件持久化)
// 支持多用户多实例
// ==========================================
import { GameCharacter } from './game-data';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

interface UserRecord {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: number;
}

interface GameStore {
  users: Map<string, UserRecord>;
  characters: Map<string, GameCharacter>;
  userCharacters: Map<string, string[]>;
}

const DATA_FILE = path.join(process.cwd(), 'game-data.json');

const store: GameStore = {
  users: new Map(),
  characters: new Map(),
  userCharacters: new Map(),
};

// 加载持久化数据
function loadStore() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      store.users = new Map(Object.entries(data.users || {}));
      store.characters = new Map(Object.entries(data.characters || {}));
      store.userCharacters = new Map(Object.entries(data.userCharacters || {}));
      console.log(`[GameStore] Loaded ${store.users.size} users, ${store.characters.size} characters`);
    }
  } catch (e) {
    console.error('[GameStore] Failed to load data:', e);
  }
}

// 保存数据到文件
function saveStore() {
  try {
    const data = {
      users: Object.fromEntries(store.users),
      characters: Object.fromEntries(store.characters),
      userCharacters: Object.fromEntries(store.userCharacters),
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('[GameStore] Failed to save data:', e);
  }
}

// 初始化时加载数据
loadStore();

// 定期保存
setInterval(saveStore, 30000);

// ===== 用户操作 =====
export function createUser(username: string, passwordHash: string): UserRecord | null {
  try {
    const user: UserRecord = {
      id: uuidv4(),
      username,
      passwordHash,
      createdAt: Date.now(),
    };
    store.users.set(user.id, user);
    store.userCharacters.set(user.id, []);
    saveStore();
    return user;
  } catch (e) {
    console.error('[GameStore] CreateUser error:', e);
    return null;
  }
}

export function getUserByUsername(username: string): UserRecord | null {
  for (const user of store.users.values()) {
    if (user.username === username) return user;
  }
  return null;
}

export function getUserById(userId: string): UserRecord | null {
  return store.users.get(userId) || null;
}

// ===== 角色操作 =====
export function createCharacter(character: GameCharacter): void {
  store.characters.set(character.id, character);
  
  const userCharIds = store.userCharacters.get(character.userId) || [];
  userCharIds.push(character.id);
  store.userCharacters.set(character.userId, userCharIds);
  
  saveStore();
}

export function getCharacter(characterId: string): GameCharacter | null {
  return store.characters.get(characterId) || null;
}

export function updateCharacter(character: GameCharacter): void {
  store.characters.set(character.id, character);
  saveStore();
}

export function getUserCharacters(userId: string): GameCharacter[] {
  const charIds = store.userCharacters.get(userId) || [];
  return charIds
    .map(id => store.characters.get(id))
    .filter((c): c is GameCharacter => c !== undefined);
}

export function getActiveCharacter(userId: string): GameCharacter | null {
  const chars = getUserCharacters(userId);
  const alive = chars.filter(c => c.isAlive);
  if (alive.length > 0) {
    return alive[alive.length - 1];
  }
  return chars.length > 0 ? chars[chars.length - 1] : null;
}

// ===== 排行榜 =====
const POSITION_SCORES: Record<string, number> = {
  '实习生': 1,
  '分析师': 2,
  '高级分析师': 3,
  '经理': 5,
  '高级经理': 7,
  '总监': 10,
  '副总裁': 15,
  '高级副总裁': 20,
  '执行副总裁': 25,
  '合伙人': 30,
  '董事总经理': 35,
  '首席官': 40,
};

export function getLeaderboard(): GameCharacter[] {
  const allChars = Array.from(store.characters.values());
  return allChars
    .filter(c => c.isAlive)
    .sort((a, b) => {
      const scoreA = a.attributes.wealth * 2 + a.attributes.reputation + 
                     (POSITION_SCORES[a.attributes.position] || 0) * 10 + 
                     a.attributes.achievements.length * 20;
      const scoreB = b.attributes.wealth * 2 + b.attributes.reputation + 
                     (POSITION_SCORES[b.attributes.position] || 0) * 10 + 
                     b.attributes.achievements.length * 20;
      return scoreB - scoreA;
    })
    .slice(0, 50);
}

export { POSITION_SCORES };

// ===== 统计 =====
export function getGameStats() {
  return {
    totalUsers: store.users.size,
    totalCharacters: store.characters.size,
    aliveCharacters: Array.from(store.characters.values()).filter(c => c.isAlive).length,
  };
}
