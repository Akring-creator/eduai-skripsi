import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { getProfile } from '@/actions/get-profile';

export async function PUT(
  req: Request,
  { params }: { params: { learningModuleId: string } }
) {
  try {
    const profile = await getProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { list } = await req.json();

    const learningModuleOwner = await db.learningModule.findUnique({
      where: {
        id: params.learningModuleId,
        profileId: profile.id,
      },
    });

    if (!learningModuleOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    for (let item of list) {
      await db.learningFlow.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    }

    return new NextResponse('Success', { status: 200 });
  } catch (error) {
    console.log('[REORDER]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
