import { currentProfile } from '@/lib/initial-profile';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
export async function PATCH(req: Request) {
  try {
    const profile = await currentProfile();
    const values = await req.json();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.profile.update({
      where: {
        id: profile.id,
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json(course);
  } catch (error) {
    console.log('[PATCH_PROFILE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
