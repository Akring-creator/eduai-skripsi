import { Banner } from '@/components/banners';
import { IconBadge } from '@/components/icon-badge';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { QuizActions } from './_components/quiz-actions';
import { QuizCategoryForm } from './_components/quiz-category-form';
import { QuizDescriptionForms } from './_components/quiz-description-form';
import { QuizImageForm } from './_components/quiz-image-form';
import { QuizTitleForm } from './_components/quiz-title-form';

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

  // Mengecek apakah data sudah terisi semua
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!quiz.isPublished && (
        <Banner label="Kuis ini tidak publik dan hanya bisa dilihat secara privat" />
      )}
      <div className="p-6">
        <Link
          href={`/teacher/quiz/${quiz.id}/draft`}
          className="flex items-center text-sm hover:opacity-75 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Kuis
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Pengaturan Kuis</h1>
            <span className="text-sm text-slate-700">
              data yang sudah terisi: {completionText}
            </span>
          </div>
          <QuizActions
            disable={!isComplete}
            quizId={params.quizId}
            isPublished={quiz.isPublished}
          />
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
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateIdQuiz;
