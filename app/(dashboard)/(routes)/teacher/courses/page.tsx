import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getProfile } from '@/actions/get-profile';

const CoursesPage = async () => {
  const profile = await getProfile();
  if (!profile) {
    return redirect('/');
  }

  const courses = await db.course.findMany({
    where: {
      profileId: profile.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;
