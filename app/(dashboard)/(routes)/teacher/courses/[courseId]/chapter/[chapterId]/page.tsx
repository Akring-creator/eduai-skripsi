import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { RedirectUrl } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

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
        <div className="w-full"></div>
      </div>
      Chapter Id
    </div>
  );
};

export default ChapterIdPage;
