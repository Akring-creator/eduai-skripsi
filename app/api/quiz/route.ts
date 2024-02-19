import { getProfile } from '@/actions/get-profile';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

// Untuk buat pertama kali Kuisnya
export async function POST(req: Request) {
  try {
    const profile = await getProfile();
    const { title } = await req.json();

    const quiz = await db.quiz.create({
      data: {
        profileId: profile!.id,
        title,
      },
    });
    return NextResponse.json(quiz);
  } catch (error) {
    console.log('[Courses]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
