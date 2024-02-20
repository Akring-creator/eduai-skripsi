import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Dashboard from './_components/dashboard';
import { use } from 'react';
import { db } from '@/lib/db';

const LibraryPage = async () => {
  const { userId } = auth();
  if (!userId) {
    return redirect('/');
  }

  const files = await db.file.findMany({
    where: {
      userId: userId,
    },
  });

  return (
    <div>
      <Dashboard files={files} />
    </div>
  );
};

export default LibraryPage;
