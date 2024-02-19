import { IconBadge } from '@/components/icon-badge';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { RedirectUrl } from '@clerk/nextjs/server';
import { ArrowLeft, Eye, LayoutDashboard, Video } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ChapterTitleForm } from './_components/chapter-title-form';
import { ChapterDescriptionForm } from './_components/chapter-description-form';
import { ChapterAccessForm } from './_components/chapter-access-form copy';
import { ChapterVideoForm } from './_components/chapter-video-form';
import { Banner } from '@/components/banners';
import { ChapterActions } from './_components/chapter-actions';
import { getProfile } from '@/actions/get-profile';

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  // Mendapatkan userId melalui auth. dan juga memastikan bahwa pengguna sudah login
  const profile = await getProfile();

  // Kalau tidak kembalikan ke semula
  if (!profile) {
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

  const isComplete = requireFields.every(Boolean);
  return (
    <>
      {!chapter.isPublished && (
        <Banner
          variant="warning"
          label="Chapter ini tidak publik dan hanya bisa dilihat secara pribadi"
        />
      )}
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
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Pembuatan Chapter</h1>
                <span className="text-sm text-slate-700">
                  Isi semua data {CompletionText}
                </span>
              </div>
              <ChapterActions
                disabled={!isComplete}
                courseId={params.courseId}
                chapterId={params.chapterId}
                isPublished={chapter.isPublished}
              />
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
            <ChapterDescriptionForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">Pengaturan Akses</h2>
              </div>
              <ChapterAccessForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Video</h2>
            </div>
            <ChapterVideoForm
              chapterId={params.chapterId}
              courseId={params.courseId}
              initialData={chapter}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterIdPage;
