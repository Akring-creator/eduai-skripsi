import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

const GamePublicIdPage = async ({
  params,
}: {
  params: { gamePublicId: string };
}) => {
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

  return <pre>{JSON.stringify(game, null, 2)}</pre>;
};

export default GamePublicIdPage;
