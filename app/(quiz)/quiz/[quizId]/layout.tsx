import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { db } from '@/lib/db';

import { QuizNavbar } from './_components/quiz-navbar';

const QuizLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { quizId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  const quiz = await db.quiz.findUnique({
    where: {
      id: params.quizId,
    },
    include: {
      questions: {
        orderBy: {
          position: 'asc',
        },
        include: {
          options: true,
        },
      },
    },
  });

  if (!quiz) {
    return redirect('/');
  }

  return (
    <div className="h-full">
      <div className="h-[80px] fixed inset-x-0 top-0 w-full z-10 ">
        <QuizNavbar initialData={quiz} />
      </div>
      <main className="px-[40px] pt-[80px] ">{children}</main>
    </div>
  );
};

export default QuizLayout;
