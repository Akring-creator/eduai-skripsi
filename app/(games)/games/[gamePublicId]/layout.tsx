import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { db } from '@/lib/db';
import { getProgress } from '@/actions/get-progress';

const GamesLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { gamePublicId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  const game = await db.game.findFirst({
    where: {
      publicId: params.gamePublicId,
    },
    include: {
      quiz: {
        include: {
          questions: {
            orderBy: {
              position: 'asc',
            },
            include: {
              options: {
                select: {
                  id: true,
                  option: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!game) {
    return redirect('/');
  }

  return (
    <div className="h-full">
      <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    </div>
  );
};

export default GamesLayout;
