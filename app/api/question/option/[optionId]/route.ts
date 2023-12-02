import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { optionId: string } }
) {
  try {
    const { userId } = auth();
    const { optionId } = params;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const option = await db.option.findUnique({
      where: {
        id: optionId,
      },
    });

    return NextResponse.json(option);
  } catch (error) {
    console.log('[OPTION]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { optionId: string } }
) {
  try {
    const { userId } = auth();
    const { optionId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const option = await db.option.update({
      where: {
        id: optionId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(option);
  } catch (error) {
    console.log('[OPTION]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
