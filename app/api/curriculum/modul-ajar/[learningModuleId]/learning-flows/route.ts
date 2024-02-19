import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getProfile } from '@/actions/get-profile';

export async function POST(
  req: Request,
  { params }: { params: { learningModuleId: string } }
) {
  try {
    const profile = await getProfile();
    const { title } = await req.json();

    if (!profile) {
      return new NextResponse('Unathourized', { status: 401 });
    }

    const learningModuleOwner = await db.learningModule.findUnique({
      where: {
        id: params.learningModuleId,
        profileId: profile.id,
      },
    });

    if (!learningModuleOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const lastFlow = await db.learningFlow.findFirst({
      where: {
        learningModuleId: params.learningModuleId,
      },
      orderBy: {
        position: 'desc',
      },
    });
    console.log(lastFlow);
    const newPosition = lastFlow ? lastFlow.position + 1 : 1;

    const learningFlow = await db.learningFlow.create({
      data: {
        title: title,
        position: newPosition,
        learningModuleId: params.learningModuleId,
      },
    });

    return NextResponse.json(learningFlow);
  } catch (error) {
    console.log('[CHAPTERS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
