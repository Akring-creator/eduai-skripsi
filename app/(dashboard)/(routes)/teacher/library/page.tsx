import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Dashboard from './_components/dashboard';
import { use } from 'react';
import { db } from '@/lib/db';
import { getProfile } from '@/actions/get-profile';

const LibraryPage = async () => {
  const profile = await getProfile();
  if (!profile) {
    return redirect('/');
  }

  const files = await db.file.findMany({
    where: {
      profileId: profile.id,
    },
  });

  return (
    <div>
      <Dashboard files={files} />
    </div>
  );
};

export default LibraryPage;
