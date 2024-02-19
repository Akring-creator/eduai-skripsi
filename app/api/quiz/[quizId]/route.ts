import { getProfile } from '@/actions/get-profile';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  { params }: { params: { quizId: string } }
) {
  try {
    const profile = await getProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const quizOwner = await db.quiz.findUnique({
      where: {
        id: params.quizId,
        profileId: profile.id,
      },
    });

    if (!quizOwner) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const deletedQuiz = await db.quiz.delete({
      where: {
        id: params.quizId,
        profileId: profile.id,
      },
    });

    return NextResponse.json(deletedQuiz);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: { quizId: string } }
) {
  try {
    // Memanggil UserID yang Login
    const profile = await getProfile();

    // Mengakses nilai quizId, data dapat dari parameter website
    const { quizId } = params;

    // mengambil values yang berupa judul, datanya dapat dari values json
    const values = await req.json();

    // Kalau bukan usernya, batalkan
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Kalau usernya, update perubahan ke database
    const quiz = await db.quiz.update({
      where: {
        id: quizId,
        profileId: profile.id,
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json(quiz);
  } catch (error) {
    console.log('[Quiz]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
