import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByUsername } from '@/lib/game-store';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json(
        { error: '用户名和密码不能为空' },
        { status: 400 }
      );
    }
    
    if (username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { error: '用户名长度需要在3-20个字符之间' },
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码长度不能少于6个字符' },
        { status: 400 }
      );
    }
    
    // 检查用户名是否已存在
    const existingUser = getUserByUsername(username);
    if (existingUser) {
      return NextResponse.json(
        { error: '用户名已存在' },
        { status: 409 }
      );
    }
    
    // 创建用户
    const passwordHash = await hashPassword(password);
    const user = createUser(username, passwordHash);
    
    if (!user) {
      return NextResponse.json(
        { error: '注册失败，请重试' },
        { status: 500 }
      );
    }
    
    // 生成Token
    const token = generateToken({ userId: user.id, username: user.username });
    
    return NextResponse.json({
      success: true,
      token,
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
