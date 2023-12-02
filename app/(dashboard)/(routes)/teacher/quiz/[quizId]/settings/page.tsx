import { IconBadge } from '@/components/icon-badge';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { LayoutDashboard } from 'lucide-react';
import { redirect, useRouter } from 'next/navigation';
import { QuizTitleForm } from './_components/quiz-title-form';
import { QuizDescriptionForms } from './_components/quiz-description-form';
import { use } from 'react';
import { QuizImageForm } from './_components/quiz-image-form';
import { QuizCategoryForm } from './_components/quiz-category-form';
import { Button } from '@/components/ui/button';
import { FinishButton } from './_components/button-exit';

const CreateIdQuiz = async ({ params }: { params: { quizId: string } }) => {
  // Mengecek apakah user yang mengakses adalah user yang sama
  const { userId } = auth();
  if (!userId) {
    return redirect('/');
  }

  //Menelusuri Database untuk menemukan baris data
  const quiz = await db.quiz.findUnique({
    where: {
      id: params.quizId,
      userId: userId,
    },
  });

  //menelusuri database category
  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  // Jika tidak ditemukan maka jangan lanjutkan
  if (!quiz) {
    return redirect('/');
  }

  // Mengambil/fetch data dari data yang ditemukan di database
  const requiredFields = [
    quiz.description,
    quiz.imageUrl,
    quiz.categoryId,
    quiz.title,
  ];
  // Mengakses library router

  // Menghitung jumlah total data yang perlu diisi
  const totalFields = requiredFields.length;

  // Mengecek jumlah total data yang telah terisi
  const completedFields = requiredFields.filter(Boolean).length;

  // Memunculkan Progress ke UI
  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Pengaturan Kuis</h1>
          <span className="text-sm text-slate-700">
            data yang sudah terisi: {completionText}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Umum</h2>
          </div>
          <QuizTitleForm initialData={quiz} quizId={quiz.id} />
          <QuizDescriptionForms initialData={quiz} quizId={quiz.id} />
          <QuizImageForm initialData={quiz} quizId={quiz.id} />
          <QuizCategoryForm
            initialData={quiz}
            quizId={quiz.id}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
          <FinishButton quizId={quiz.id} />
        </div>
      </div>
    </div>
  );
};

export default CreateIdQuiz;
