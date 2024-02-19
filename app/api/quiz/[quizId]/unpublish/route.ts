import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { getProfile } from '@/actions/get-profile';

export async function PATCH(
  req: Request,
  { params }: { params: { quizId: string } }
) {
  try {
    const profile = await getProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const quiz = await db.quiz.findUnique({
      where: {
        id: params.quizId,
        profileId: profile.id,
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!quiz) {
      return new NextResponse('Not found', { status: 404 });
    }

    const unpublishedQuiz = await db.quiz.update({
      where: {
        id: params.quizId,
        profileId: profile.id,
      },
      data: {
        isPublished: false,
      },
    });

    return NextResponse.json(unpublishedQuiz);
  } catch (error) {
    console.log('[QUIZ_ID_UNPUBLISH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
