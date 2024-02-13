import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { db } from '@/lib/db';
import { getProgress } from '@/actions/get-progress';

import { CourseSidebar } from './_components/quiz-sidebar';
import { CourseNavbar } from './_components/quiz-navbar';

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
      userId: userId,
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

  if (!course) {
    return redirect('/');
  }

  const progressCount = await getProgress(userId, course.id);

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <CourseNavbar course={course} progressCount={progressCount} />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    </div>
  );
};

export default QuizLayout;
