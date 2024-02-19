import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { IconBadge } from '@/components/icon-badge';
import { LibrarySquare } from 'lucide-react';
import { Metadata } from './_components/quiz-metadata';
import { QuestionForm } from './_components/question-form';
import { Banner } from '@/components/banners';
import { getProfile } from '@/actions/get-profile';

const QuizDraft = async ({ params }: { params: { quizId: string } }) => {
  // Memastikan Autentifikasi
  const profile = await getProfile();

  if (!profile) {
    return redirect('/');
  }

  const quiz = await db.quiz.findUnique({
    where: {
      id: params.quizId,
      profileId: profile.id,
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
    <>
      {!quiz.isPublished && (
        <Banner label="Kuis ini tidak publik dan hanya bisa dilihat secara privat" />
      )}
      <div className="p-6">
        <div className="flex gap-6 mt-2">
          <div className="w-full pr-4">
            <Metadata initialData={quiz} />
            <QuestionForm initialData={quiz} quizId={quiz.id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizDraft;
