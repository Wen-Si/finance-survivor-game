import { NextResponse } from 'next/server';
import { getLeaderboard, getGameStats } from '@/lib/game-store';

export async function GET() {
  try {
    const leaderboard = getLeaderboard();
    const stats = getGameStats();
    
    return NextResponse.json({
      leaderboard: leaderboard.map(c => ({
        id: c.id,
        name: c.name,
        position: c.attributes.position,
        company: c.attributes.company,
        wealth: c.attributes.wealth,
        reputation: c.attributes.reputation,
        day: c.currentDay,
        achievements: c.attributes.achievements.length,
        isAlive: c.isAlive,
      })),
      stats,
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
