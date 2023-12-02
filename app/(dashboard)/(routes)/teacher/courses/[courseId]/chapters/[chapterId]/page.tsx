import { IconBadge } from '@/components/icon-badge';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { RedirectUrl } from '@clerk/nextjs/server';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ChapterTitleForm } from './_components/chapter-title-form';

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  // Mendapatkan userId melalui auth. dan juga memastikan bahwa pengguna sudah login
  const { userId } = auth();

  // Kalau tidak kembalikan ke semula
  if (!userId) {
    return redirect('/');
  }

  // Mengakses data chapter yang akan diedit
  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
    include: {
      muxData: true,
    },
  });
  // Klaau chapter ngak ditemukan back to homepage
  if (!chapter) {
    return redirect('/');
  }

  // menentukan field yang dibutuhkan
  const requireFields = [chapter.title, chapter.description, chapter.videoUrl];

  const TotalFields = requireFields.length;
  const completedFields = requireFields.filter(Boolean).length;

  const CompletionText = `(${completedFields}/${TotalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/teacher/courses/${params.courseId}`}
            className="flex items-center text-sm hover:opacity-75 transotopn mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Pengaturan Kursus
          </Link>
          <div className="flex items-center justify-betwwen w-full">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Pembuatan Chapter</h1>
              <span className="text-sm text-slate-700">
                Isi semua data {CompletionText}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Kustomisasi Chaptermu</h2>
            </div>
          </div>
          <ChapterTitleForm
            initialData={chapter}
            courseId={params.courseId}
            chapterId={params.chapterId}
          />
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
