import { currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser();
    console.log('1 Tahap Auten');

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
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
        userId_courseId: {
          userId: user.id,
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
        userId: user.id,
      },
    });
    console.log(purchased.userId);

    return NextResponse.json(purchased);
  } catch (error) {
    console.log('[COURSE_ID_CHECKOUT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
