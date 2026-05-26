import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';
import { createCharacter, getActiveCharacter, getUserCharacters } from '@/lib/game-store';
import { generateInitialAttributes } from '@/lib/game-data';
import { v4 as uuidv4 } from 'uuid';
import type { GameCharacter } from '@/lib/game-data';

export async function POST(request: NextRequest) {
  try {
    // 验证用户
    const token = getTokenFromHeader(request.headers.get('Authorization'));
    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }
    
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: '登录已过期' }, { status: 401 });
    }
    
    const body = await request.json();
    const { name, personality, skills, careerDirection, background } = body;
    
    if (!name || !personality || !careerDirection) {
      return NextResponse.json(
        { error: '角色姓名、品格描述和职业方向为必填项' },
        { status: 400 }
      );
    }
    
    // 检查是否已有存活角色
    const existingChars = getUserCharacters(payload.userId);
    const aliveChars = existingChars.filter(c => c.isAlive);
    if (aliveChars.length >= 3) {
      return NextResponse.json(
        { error: '每个用户最多同时拥有3个存活角色' },
        { status: 400 }
      );
    }
    
    // 生成初始属性
    const attributes = generateInitialAttributes(personality, skills || [], careerDirection);
    
    // 创建角色
    const character: GameCharacter = {
      id: uuidv4(),
      userId: payload.userId,
      name,
      personality,
      skills: skills || [],
      careerDirection,
      background: background || '',
      attributes,
      currentDay: 0,
      isAlive: true,
      events: [],
      lastSimulated: Date.now(),
      createdAt: Date.now(),
    };
    
    createCharacter(character);
    
    return NextResponse.json({
      success: true,
      character,
    });
  } catch (error) {
    console.error('Create character error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

// 获取用户角色列表
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromHeader(request.headers.get('Authorization'));
    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }
    
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: '登录已过期' }, { status: 401 });
    }
    
    const characters = getUserCharacters(payload.userId);
    const activeCharacter = getActiveCharacter(payload.userId);
    
    return NextResponse.json({
      characters,
      activeCharacter,
    });
  } catch (error) {
    console.error('Get characters error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
