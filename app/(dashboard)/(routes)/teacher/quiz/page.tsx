import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

const listofItem = ['item'];

const QuizPage = async () => {
  const { userId } = auth();
  if (!userId) {
    return redirect('/');
  }

  const quiz = await db.quiz.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return (
    <div className="p-6">
      <DataTable columns={columns} data={quiz} />
    </div>
  );
};

export default QuizPage;
