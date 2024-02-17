'use client';
import { Game, Question, Quiz, Option } from '@prisma/client';
import { useEffect, useMemo, useState } from 'react';
import QuestionCard from './question-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface GameLogicProps {
  game: Game & {
    quiz: Quiz & {
      questions: (Pick<
        Question,
        'id' | 'question' | 'questionType' | 'imageUrl' | 'position'
      > & { options: Pick<Option, 'id' | 'option'>[] })[];
    };
  };
}
const GameLogic = ({ game }: GameLogicProps) => {
  const [questionNumber, setQuestionNumber] = useState<number>(1);

  const totalQuestion = game.quiz.questions.length;
  const currentQuestion = useMemo(() => {
    return game.quiz.questions[questionNumber - 1];
  }, [questionNumber, game.quiz.questions]);

  const onNextQuestion = () => {
    if (questionNumber < totalQuestion) {
      setQuestionNumber(questionNumber + 1);
    } else {
      toast('Kau diujung quiz', {
        description: 'Ngak bisa kemana2',
      });
    }
  };

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div className="p-4">
        <QuestionCard
          initialData={currentQuestion}
          questionNumber={questionNumber}
        />
      </div>
      <div className="mt-4 flex justify-end gap-x-2">
        <Button
          variant="outline"
          disabled={questionNumber === 1}
          onClick={() => setQuestionNumber(questionNumber - 1)}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Sebelumnya
        </Button>
        <Button
          variant="default"
          className="flex items-center  hover:bg-blue-600 text-white"
          onClick={onNextQuestion}
        >
          {questionNumber === totalQuestion ? 'Kirim' : 'Selanjutnya'}
          <ChevronRight className="h-5 w-5 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default GameLogic;
