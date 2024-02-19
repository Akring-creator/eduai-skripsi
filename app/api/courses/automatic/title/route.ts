import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { chapterGenerator } from '@/lib/openai';
import { getProfile } from '@/actions/get-profile';
export const POST = async (req: Request) => {
  try {
    const profile = await getProfile();

    if (!profile) {
      return new NextResponse('Unathourized', { status: 401 });
    }

    const { title, numOfChapters } = await req.json();

    const chapters = await chapterGenerator(title, numOfChapters);

    return NextResponse.json(chapters);
  } catch (error) {
    console.log('[QUESTION_GENERATOR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
