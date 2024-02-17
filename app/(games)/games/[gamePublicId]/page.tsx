import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import QuestionCard from './_components/question-card';
import GameLogic from './_components/game-logic';

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
            select: {
              id: true,
              question: true,
              questionType: true,
              imageUrl: true,
              position: true,
              options: {
                select: {
                  id: true,
                  option: true,
                },
              },
            },
            orderBy: {
              position: 'asc',
            },
          },
        },
      },
    },
  });

  if (!game) {
    return redirect('/');
  }

  return <GameLogic game={game} />;
};

export default GamePublicIdPage;
