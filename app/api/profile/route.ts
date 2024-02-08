import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { currentUser, redirectToSignIn } from '@clerk/nextjs';

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();
    const user = await currentUser();

    if (!user) {
      return redirectToSignIn();
    }

    const newProfile = await db.profile.create({
      data: {
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
        username: username,
      },
    });

    return NextResponse.json(newProfile);
  } catch (error) {
    console.error('[CREATE_PROFILE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
