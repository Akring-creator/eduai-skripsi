import { getProfile } from '@/actions/get-profile';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  { params }: { params: { quizId: string; questionId: string } }
) {
  try {
    const profile = await getProfile();
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Memastikan bahwa pengguna merupakan pemiliki Quiz
    const quizOwner = await db.quiz.findUnique({
      where: {
        id: params.quizId,
        profileId: profile.id,
      },
    });

    if (!quizOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const question = await db.question.findUnique({
      where: {
        id: params.questionId,
        quizId: params.quizId,
      },
    });

    if (!question) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const deletedquestion = await db.question.delete({
      where: {
        id: params.questionId,
        quizId: params.quizId,
      },
    });

    return NextResponse.json(deletedquestion);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
export async function GET(
  req: Request,
  { params }: { params: { quizId: string; questionId: string } }
) {
  try {
    // mendapatkan info login pengguna
    const profile = await getProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Memastikan bahwa pengguna merupakan pemiliki Quiz
    const quizOwner = await db.quiz.findUnique({
      where: {
        id: params.quizId,
        profileId: profile.id,
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
    const profile = await getProfile();
    const values = await req.json();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Memastikan bahwa pengguna merupakan pemiliki Quiz
    const quizOwner = await db.quiz.findUnique({
      where: {
        id: params.quizId,
        profileId: profile.id,
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
