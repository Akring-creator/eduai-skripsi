import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { DocumentCreator } from '@/lib/export-quiz';
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
      return new NextResponse('Unathourized', { status: 401 });
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
    const documentCreator = new DocumentCreator();
    const doc = documentCreator.create(quiz);
    const makeDocx = () => {
      Packer.toBuffer(doc).then((buffer: any) => {
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${quiz.title}.docx`;
        link.click();
      });
    };
    makeDocx();
    console.log(6);
    return NextResponse.json(document);
  } catch (error) {
    console.log('[QUESTION_GENERATOR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
