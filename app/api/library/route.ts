import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const file = await db.file.findMany({
      where: {
        userId,
      },
    });
    return NextResponse.json(file);
  } catch (error) {
    console.log('[learningModules]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { url, name } = await req.json();

    if (!userId) {
      return new NextResponse('Unathourized', { status: 401 });
    }

    const file = await db.file.create({
      data: {
        userId: userId,
        url,
        name: name,
        uploadStatus: 'PROCESSING',
      },
    });

    return NextResponse.json(file);
  } catch (error) {
    console.log('COURSE_ID_ATTACHMENTS', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
export async function DELETE(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { fileId } = await req.json();

    // Pastikan file yang hendak dihapus milik pengguna yang sedang masuk
    const fileToDelete = await db.file.findFirst({
      where: {
        id: fileId,
        userId,
      },
    });

    if (!fileToDelete) {
      return new NextResponse('File not found or unauthorized', {
        status: 404,
      });
    }

    // Lakukan penghapusan file dari database
    await db.file.delete({
      where: {
        userId,
        id: fileId,
      },
    });

    return new NextResponse('File deleted successfully', { status: 200 });
  } catch (error) {
    console.error('[learningModules]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
