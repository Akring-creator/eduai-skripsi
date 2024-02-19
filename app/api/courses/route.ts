import { getProfile } from '@/actions/get-profile';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const profile = await getProfile();
    const { title } = await req.json();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.create({
      data: {
        profileId: profile.id,
        title,
      },
    });
    return NextResponse.json(course);
  } catch (error) {
    console.log('[Courses]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
