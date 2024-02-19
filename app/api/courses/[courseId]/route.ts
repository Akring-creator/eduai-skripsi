import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import Mux from '@mux/mux-node';
import { getProfile } from '@/actions/get-profile';

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
);

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const profile = await getProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        profileId: profile.id,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse('Not Found', { status: 404 });
    }

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await Video.Assets.del(chapter.muxData.assetId);
      }
    }

    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId,
      },
    });
    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log('[COURSE_ID_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const profile = await getProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const values = await req.json();

    const course = await db.course.update({
      where: {
        id: params.courseId,
        profileId: profile.id,
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json(course);
  } catch (error) {
    console.log('[Courses]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
