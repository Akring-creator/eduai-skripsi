import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { basicType } from '@/lib/openai';

export const POST = async (
  req: Request,
  { params }: { params: { quizId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unathourized', { status: 401 });
    }

    const quizOwner = await db.quiz.findUnique({
      where: {
        id: params.quizId,
        userId: userId,
      },
    });

    if (!quizOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { materi, numberOfQuestions, numberOfOptions, guidance } =
      await req.json();

    // Fix it nanti
    const example_question = '';

    const questions = await basicType(
      numberOfQuestions,
      numberOfOptions,
      materi,
      guidance,
      example_question
    );

    return NextResponse.json(questions);
  } catch (error) {
    console.log('[QUESTION_GENERATOR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
