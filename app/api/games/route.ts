
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { quizId } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!quizId) {
      return new NextResponse('Missing Quiz ID', { status: 404 });
    }

    const game = await db.game.create({
      data: {
        creatorId: userId,
        quizId: quizId,
      },
    });
    return NextResponse.json(game);
  } catch (error) {
    console.log('[GAME_CREATION]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
