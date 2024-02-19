import { getProfile } from '@/actions/get-profile';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
db;
export async function PATCH(
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
    });

    if (!course) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const unpublishedCourse = await db.course.update({
      where: {
        id: params.courseId,
        profileId: profile.id,
      },
      data: {
        isPublished: false,
      },
    });

    return NextResponse.json(unpublishedCourse);
  } catch (error) {
    console.log('[COURSE_ID_UNPUBLISH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
