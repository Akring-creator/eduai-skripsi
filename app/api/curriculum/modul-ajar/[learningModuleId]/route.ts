import { getProfile } from '@/actions/get-profile';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  { params }: { params: { learningModuleId: string } }
) {
  try {
    const profile = await getProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const learningModule = await db.learningModule.findUnique({
      where: {
        id: params.learningModuleId,
        profileId: profile.id,
      },
    });

    if (!learningModule) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const deletedLearningModule = await db.learningModule.delete({
      where: {
        id: params.learningModuleId,
      },
    });
    return NextResponse.json(deletedLearningModule);
  } catch (error) {
    console.log('[LEARNING_MODULE_ID_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: { learningModuleId: string } }
) {
  try {
    const profile = await getProfile();
    const values = await req.json();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const learningModule = await db.learningModule.update({
      where: {
        id: params.learningModuleId,
        profileId: profile.id,
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json(learningModule);
  } catch (error) {
    console.log('[Courses]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
