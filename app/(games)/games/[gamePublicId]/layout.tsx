import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { db } from '@/lib/db';
import { getProgress } from '@/actions/get-progress';
import { GameNavbar } from './_components/game-navbar';
import { differenceInSeconds } from 'date-fns';
import { getProfile } from '@/actions/get-profile';

const GamesLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { gamePublicId: string };
}) => {
  const profile = await getProfile();

  if (!profile) {
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
    <div className="h-full bg-slate-300">
      <div className="h-[80px] fixed inset-x-0 top-0 w-full z-10 ">
        <GameNavbar initialData={game} />
      </div>
      <main className="pt-[80px] h-full">{children}</main>
    </div>
  );
};

export default GamesLayout;
