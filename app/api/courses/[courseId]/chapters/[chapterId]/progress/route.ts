import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { getProfile } from '@/actions/get-profile';

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const profile = await getProfile();
    const { isCompleted } = await req.json();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userProgress = await db.userProgress.upsert({
      where: {
        profileId_chapterId: {
          profileId: profile.id,
          chapterId: params.chapterId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        profileId: profile.id,
        chapterId: params.chapterId,
        isCompleted,
      },
    });

    return NextResponse.json(userProgress);
  } catch (error) {
    console.log('[CHAPTER_ID_PROGRESS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
