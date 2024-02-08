import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();
    let usernameExists: boolean = false;

    const user = await db.profile.findUnique({
      where: {
        username: username,
      },
    });

    if (user) {
      usernameExists = true;
    }

    return NextResponse.json(usernameExists);
  } catch (error) {
    console.error('[USERNAME_CHECKER]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
