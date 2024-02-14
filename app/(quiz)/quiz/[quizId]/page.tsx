import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Metadata } from './_components/quiz-metadata';
import { QuestionForm } from './_components/question-form';

const CourseIdPage = async ({ params }: { params: { quizId: string } }) => {
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
    <div className="p-6">
      <div className="flex mt-2">
        <div className="w-full pr-4">
          <Metadata initialData={quiz} />
          <QuestionForm initialData={quiz} />
        </div>
      </div>
    </div>
  );
};

export default CourseIdPage;
