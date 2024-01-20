import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Dashboard from './_components/dashboard';

const LibraryPage = () => {
  const { userId } = auth();
  if (!userId) {
    return redirect('/');
  }

  return (
    <div>
      <Dashboard />
    </div>
  );
};

export default LibraryPage;
