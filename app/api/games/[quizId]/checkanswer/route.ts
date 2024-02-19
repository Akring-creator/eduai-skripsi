import { getProfile } from '@/actions/get-profile';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { quizId: string } }
) {
  try {
    const profile = await getProfile();
    const { data } = await req.json();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const result = { rightAnswer: 0, wrongAnswer: 0 };

    await Promise.all(
      data.map(async (q: any) => {
        if (q.questionType === 'multipleChoice') {
          const correct = await db.option.findUnique({
            where: {
              id: q.userAnswer,
              isKeyAnswer: true,
            },
          });

          if (correct !== null) {
            result.rightAnswer++; // Tambahkan nilai jawaban yang benar
            console.log('Benar');
          } else {
            result.wrongAnswer++; // Tambahkan nilai jawaban yang salah
          }
        }
      })
    );

    return NextResponse.json(result);
  } catch (error) {
    console.log('[ANSWER_CHECKED]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
