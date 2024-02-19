import { currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { getProfile } from '@/actions/get-profile';

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const profile = await getProfile();
    console.log('1 Tahap Auten');

    if (!profile || !profile.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });
    console.log('2 Tahap Pencarian Kursus');

    const purchase = await db.purchase.findUnique({
      where: {
        profileId_courseId: {
          profileId: profile.id,
          courseId: params.courseId,
        },
      },
    });

    if (purchase) {
      return new NextResponse('Sudah mengikuti kelas', { status: 400 });
    }

    if (!course) {
      return new NextResponse('Not found', { status: 404 });
    }

    const purchased = await db.purchase.create({
      data: {
        courseId: params.courseId,
        profileId: profile.id,
      },
    });
    console.log(purchased.profileId);

    return NextResponse.json(purchased);
  } catch (error) {
    console.log('[COURSE_ID_CHECKOUT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
