import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';
import { getCharacter, updateCharacter, getActiveCharacter } from '@/lib/game-store';
import { simulateMultipleDays } from '@/lib/game-engine';

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromHeader(request.headers.get('Authorization'));
    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }
    
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: '登录已过期' }, { status: 401 });
    }
    
    const body = await request.json();
    const { characterId, days = 1 } = body;
    
    // 获取角色
    const character = characterId 
      ? getCharacter(characterId) 
      : getActiveCharacter(payload.userId);
    
    if (!character) {
      return NextResponse.json(
        { error: '角色不存在' },
        { status: 404 }
      );
    }
    
    if (character.userId !== payload.userId) {
      return NextResponse.json(
        { error: '无权操作此角色' },
        { status: 403 }
      );
    }
    
    if (!character.isAlive) {
      return NextResponse.json(
        { error: '角色已退出职场，无法继续模拟' },
        { status: 400 }
      );
    }
    
    // 限制单次模拟天数
    const simDays = Math.min(Math.max(1, days), 7);
    
    // 执行模拟
    const events = await simulateMultipleDays(character, simDays);
    
    // 保存更新
    updateCharacter(character);
    
    return NextResponse.json({
      success: true,
      character,
      newEvents: events,
    });
  } catch (error) {
    console.error('Simulate error:', error);
    return NextResponse.json(
      { error: '模拟失败，请重试' },
      { status: 500 }
    );
  }
}
