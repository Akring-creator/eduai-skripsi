import { getProfile } from '@/actions/get-profile';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  { params }: { params: { fileId: string } }
) {
  try {
    const profile = await getProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Pastikan file yang hendak dihapus milik pengguna yang sedang masuk
    const fileToDelete = await db.file.findFirst({
      where: {
        id: params.fileId,
        profileId: profile.id,
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
        profileId: profile.id,
        id: params.fileId,
      },
    });

    return new NextResponse('File deleted successfully', { status: 200 });
  } catch (error) {
    console.error('[PDF_FILE_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
