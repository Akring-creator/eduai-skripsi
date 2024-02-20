import { getProfile } from '@/actions/get-profile';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { quizId: string } }
) {
  try {
    const profile = await getProfile();
    console.log(profile);

    const values = await req.json();

    let now;

    if (values.gameType === 'FLASH') {
      now = new Date();
      now.setMinutes(now.getMinutes() + values.time);
    }

    const game = await db.game.create({
      data: {
        profileId: profile?.id!,
        title: values.title,
        gameType: values.gameType,
        quizId: params.quizId,
        timeEnded: now,
        timeLimit: values.time,
      },
    });
    return NextResponse.json(game);
  } catch (error) {
    console.log('[GAME_CREATION]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
