import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const POST = async (
  req: Request,
  { params }: { params: { quizId: string } }
) => {
  try {
    const { userId } = auth();
    const rawData = await req.json();

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
    for (const data of rawData) {
      const options = data.options;

      const lastQuestion = await db.question.findFirst({
        where: {
          quizId: params.quizId,
        },
        orderBy: {
          position: 'desc',
        },
      });

      const newPosition = lastQuestion ? lastQuestion.position + 1 : 1;

      const newQuestion = await db.question.create({
        data: {
          questionType: 'multipleChoice',
          question: data.question,
          answer: data.answer,
          explanation: data.explanation,
          quizId: data.quizId,
          position: newPosition,
        },
      });

      for (const option of options) {
        if (option === data.answer) {
          await db.option.create({
            data: {
              questionId: newQuestion.id,
              option: option,
              isKeyAnswer: true,
            },
          });
        } else {
          const newOption = await db.option.create({
            data: {
              questionId: newQuestion.id,
              option: option,
            },
          });
        }
      }
    }
    return NextResponse.json('Success', { status: 200 });
  } catch (error) {
    console.log('Something Wrong: ', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
