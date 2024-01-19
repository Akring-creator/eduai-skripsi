import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { DocumentCreator, ExperimentDocumentCreator } from '@/lib/export-quiz';
const docx = require('docx');
const { Packer, Document } = docx;

export const POST = async (
  req: Request,
  { params }: { params: { quizId: string } }
) => {
  console.log(1);
  try {
    const { userId } = auth();
    console.log(2);
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    console.log(3);
    const quiz = await db.quiz.findUnique({
      where: {
        id: params.quizId,
        userId: userId,
      },
      include: {
        questions: { include: { options: true } },
      },
    });
    console.log(4);
    if (!quiz) {
      return new NextResponse('Not Found', { status: 404 });
    }
    console.log(5);
    const documentCreator = new ExperimentDocumentCreator({
      title: 'Something',
      description: 'Another Thing',
    });
    const doc = documentCreator.create();

    const makeDocx = async () => {
      return await Packer.toBuffer(doc);
    };

    const buffer = await makeDocx();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    console.log(blob);
    return NextResponse.json(blob);
  } catch (error) {
    console.log('[QUESTION_GENERATOR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
