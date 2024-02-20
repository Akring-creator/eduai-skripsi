import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function PATCH(
  req: Request,
  { params }: { params: { quizId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const quiz = await db.quiz.findUnique({
      where: {
        id: params.quizId,
        userId,
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

    // const hasPublishedChapter = course.chapters.some(
    //   (chapter) => chapter.isPublished
    // );

    if (
      !quiz.title ||
      !quiz.description ||
      !quiz.imageUrl ||
      !quiz.categoryId
    ) {
      return new NextResponse('Missing required fields', { status: 401 });
    }

    const publishedQuiz = await db.quiz.update({
      where: {
        id: params.quizId,
        userId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedQuiz);
  } catch (error) {
    console.log('[QUIZ_ID_PUBLISH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
