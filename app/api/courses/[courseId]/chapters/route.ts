import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { title, description, videoUrl, videoType, position } =
      await req.json();

    if (!userId) {
      return new NextResponse('Unathourized', { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: 'desc',
      },
    });
    let newPosition;
    if (position === null) {
      newPosition = lastChapter ? lastChapter.position + 1 : 1;
    } else {
      newPosition = position;
    }

    const chapter = await db.chapter.create({
      data: {
        title: title,
        position: newPosition,
        courseId: params.courseId,
        videoType: videoType,
        videoUrl: videoUrl,
        description: description,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log('[CHAPTERS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
