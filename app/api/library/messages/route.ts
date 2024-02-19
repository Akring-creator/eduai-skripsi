import { getProfile } from '@/actions/get-profile';
import { MAX_MESSAGES_LIMIT } from '@/config/constant';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { Message } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const profile = await getProfile();
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get('cursor');
    const fileId = searchParams.get('fileId');
    const limit = MAX_MESSAGES_LIMIT;
    console.log('masuk sini dulu');

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!fileId) {
      return new NextResponse('File ID is Missing', { status: 400 });
    }

    const file = await db.file.findUnique({
      where: {
        id: fileId,
        profileId: profile.id,
      },
    });
    console.log('masuk sini');

    if (!file) {
      return new NextResponse('File not found', { status: 404 });
    }
    let messages: Message[] = [];

    if (cursor) {
      messages = await db.message.findMany({
        take: MAX_MESSAGES_LIMIT,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          fileId,
        },

        orderBy: {
          createdAt: 'asc',
        },
      });
    } else {
      messages = await db.message.findMany({
        take: MAX_MESSAGES_LIMIT,
        where: {
          fileId,
        },

        orderBy: {
          createdAt: 'asc',
        },
      });
    }

    let nextCursor: typeof cursor | undefined = undefined;
    if (messages.length > limit) {
      const nextItem = messages.pop();
      nextCursor = nextItem?.id;
    }

    const data = { messages: messages, nextCursor: nextCursor };
    return NextResponse.json(data);
  } catch (error) {
    console.error('[FETCH_MESSAGES]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
