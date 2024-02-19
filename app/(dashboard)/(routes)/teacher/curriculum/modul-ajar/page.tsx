import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { getProfile } from '@/actions/get-profile';

const LearningModulePage = async () => {
  const profile = await getProfile();
  if (!profile) {
    return redirect('/');
  }

  const lm = await db.learningModule.findMany({
    where: {
      profileId: profile.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return (
    <div className="p-6">
      <DataTable columns={columns} data={lm} />
    </div>
  );
};

export default LearningModulePage;
