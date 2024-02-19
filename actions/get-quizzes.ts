import { Category, Quiz } from '@prisma/client';

import { db } from '@/lib/db';

type QuizWithCategory = Quiz & {
  category: Category | null;
  questions: { id: string }[];
};

type getQuizzes = {
  profileId: string;
  title?: string;
};

export const getQuizzes = async ({
  profileId,
  title,
}: getQuizzes): Promise<QuizWithCategory[]> => {
  try {
    const quiz = await db.quiz.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
      },
      include: {
        category: true,
        questions: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return quiz;
  } catch (error) {
    console.log('[GET_QUIZ]', error);
    return [];
  }
};
