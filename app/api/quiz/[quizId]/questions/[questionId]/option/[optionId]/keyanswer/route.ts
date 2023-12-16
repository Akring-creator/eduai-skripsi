import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  {
    params,
  }: { params: { quizId: string; questionId: string; optionId: string } }
) {
  try {
    const { userId } = auth();
    const values = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Memastikan bahwa pengguna merupakan pemilik Quiz
    const quizOwner = await db.quiz.findUnique({
      where: {
        id: params.quizId,
        userId,
      },
    });

    if (!quizOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const existedKeyAnswer = await db.option.findFirst({
      where: {
        questionId: params.questionId,
        isKeyAnswer: true,
      },
    });
    if (existedKeyAnswer) {
      const option = await db.option.update({
        where: {
          id: existedKeyAnswer.id,
          questionId: params.questionId,
        },
        data: {
          isKeyAnswer: false,
        },
      });
    }
    const option = await db.option.update({
      where: {
        id: params.optionId,
        questionId: params.questionId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(option);
  } catch (error) {
    console.log('[OPTION_ID_KEY_ANSWER]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
