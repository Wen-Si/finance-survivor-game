import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';
import { getCharacter, getActiveCharacter, getUserCharacters } from '@/lib/game-store';

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
    
    const { searchParams } = new URL(request.url);
    const characterId = searchParams.get('characterId');
    
    const character = characterId 
      ? getCharacter(characterId) 
      : getActiveCharacter(payload.userId);
    
    if (!character) {
      const characters = getUserCharacters(payload.userId);
      return NextResponse.json({
        character: null,
        characters,
      });
    }
    
    if (character.userId !== payload.userId) {
      return NextResponse.json({ error: '无权查看此角色' }, { status: 403 });
    }
    
    const characters = getUserCharacters(payload.userId);
    
    return NextResponse.json({
      character,
      characters,
    });
  } catch (error) {
    console.error('Status error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
