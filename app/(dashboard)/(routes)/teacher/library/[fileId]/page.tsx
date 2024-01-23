import PdfRenderer from './_components/pdf-render';
import { db } from '@/lib/db';

import { notFound, redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';
import PDFRenderer from './_components/pdf-render';

interface PageProps {
  params: {
    fileid: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { fileid } = params;

  const { userId } = auth();

  if (!userId) redirect(`/`);

  const file = await db.file.findFirst({
    where: {
      id: fileid,
      userId: userId,
    },
  });

  if (!file) notFound();

  return (
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        {/* Left sidebar & main wrapper */}
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            {/* Main area */}
            <PDFRenderer url={file.url} />
          </div>
        </div>

        <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <p className="text-xl">Chatnya Nanti Disini</p>
        </div>
      </div>
    </div>
  );
};

export default Page;
