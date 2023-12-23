import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { DocumentCreator } from '@/lib/export-quiz';
const docx = require('docx');
const { Packer } = docx;
const fs = require('fs');

export const POST = async (
  req: Request,
  { params }: { params: { quizId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const quiz = await db.quiz.findUnique({
      where: {
        id: params.quizId,
        userId: userId,
      },
      include: {
        questions: { include: { options: true } },
      },
    });
    if (!quiz) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const documentCreator = new DocumentCreator();
    const doc = documentCreator.create(quiz);
    const buffer = await Packer.toBuffer(doc);
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/octet-stream', // Tipe konten untuk buffer
        'Content-Disposition': 'attachment; filename="quiz.docx"', // Nama file yang akan didownload
      },
    });
  } catch (error) {
    console.log('[QUESTION_GENERATOR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
