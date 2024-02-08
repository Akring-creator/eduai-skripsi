import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { db } from '@/lib/db';
import { currentProfile } from '@/lib/initial-profile';

const SetupLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const profile = await currentProfile();

  if (profile) {
    return redirect('/');
  }

  return (
    <div className="h-full">
      <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    </div>
  );
};

export default SetupLayout;
