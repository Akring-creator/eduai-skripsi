import { getProfile } from '@/actions/get-profile';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  {
    params,
  }: { params: { quizId: string; questionId: string; optionId: string } }
) {
  try {
    //Memastikan bahwa pengguna sudah login dan mengambil data JSON
    const profile = await getProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Memastikan bahwa pengguna merupakan pemilik Quiz
    const quizOwner = await db.quiz.findUnique({
      where: {
        id: params.quizId,
        profileId: profile.id,
      },
    });

    if (!quizOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const option = await db.option.findUnique({
      where: {
        id: params.optionId,
        questionId: params.questionId,
      },
    });

    return NextResponse.json(option);
  } catch (error) {
    console.log('[OPTION]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: { params: { quizId: string; questionId: string; optionId: string } }
) {
  try {
    const profile = await getProfile();
    const values = await req.json();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Memastikan bahwa pengguna merupakan pemilik Quiz
    const quizOwner = await db.quiz.findUnique({
      where: {
        id: params.quizId,
        profileId: profile.id,
      },
    });

    if (!quizOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
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

    // Check if there is existed key,
    // Kalau udah ada, set false kan
    // baru yang baru di set true

    return NextResponse.json(option);
  } catch (error) {
    console.log('[OPTION]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
