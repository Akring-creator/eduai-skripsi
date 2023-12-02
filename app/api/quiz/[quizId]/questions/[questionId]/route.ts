import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { quizId: string; questionId: string } }
) {
  try {
    // mendapatkan info login pengguna
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Memastikan bahwa pengguna merupakan pemiliki Quiz
    const quizOwner = await db.quiz.findUnique({
      where: {
        id: params.quizId,
        userId,
      },
    });

    if (!quizOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Mengakses Question di Quiz
    const question = await db.question.findUnique({
      where: {
        id: params.questionId,
        quizId: params.quizId,
      },
    });
    return NextResponse.json(question);
  } catch (error) {
    console.log('[QUESTION]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: { quizId: string; questionId: string } }
) {
  try {
    // Memastikan pengguna login dan mengambil data Json
    const { userId } = auth();
    const values = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Memastikan bahwa pengguna merupakan pemiliki Quiz
    const quizOwner = await db.quiz.findUnique({
      where: {
        id: params.quizId,
        userId,
      },
    });

    if (!quizOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Mengupdate Pertanyaan
    const question = await db.question.update({
      where: {
        id: params.questionId,
        quizId: params.quizId,
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json(question);
  } catch (error) {
    console.log('[QUESTION]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
