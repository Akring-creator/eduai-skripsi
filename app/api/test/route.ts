import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { chapterGenerator } from '@/lib/openai';
export const POST = async (
  req: Request,
  { params }: { params: { quizId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
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
