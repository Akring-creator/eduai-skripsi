'use client';
import { Game, Question, Quiz, Option } from '@prisma/client';
import { useEffect, useMemo, useState } from 'react';
import QuestionCard from './question-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import GameResult from './game-result';

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
  const initialQuestions = useMemo(() => {
    return game.quiz.questions.map((question) => ({
      ...question,
      userAnswer: null as string | null,
      correctAnswer: null as string | null,
    }));
  }, [game]);

  const [questions, setQuestions] = useState(initialQuestions);
  const [onPlay, setOnPlay] = useState(true);

  const [questionNumber, setQuestionNumber] = useState<number>(1);

  const [result, setResult] = useState(null);

  const totalQuestion = game.quiz.questions.length;
  const currentQuestion = useMemo(() => {
    return questions[questionNumber - 1];
  }, [questionNumber, questions]);

  const onNextQuestion = async () => {
    if (questionNumber < totalQuestion) {
      setQuestionNumber(questionNumber + 1);
    } else if (questionNumber === totalQuestion) {
      try {
        const result = await axios.post(
          `/api/games/${game.quizId}/checkanswer`,
          { data: questions }
        );
        setResult(result.data);
        setOnPlay(false);
      } catch (error) {}
    }
  };

  const updateUserAnswer = (value: string) => {
    const updatedQuestions = questions.map((question) => {
      if (question.id === currentQuestion.id) {
        return {
          ...question,
          userAnswer: value,
        };
      }
      return question;
    });
    setQuestions(updatedQuestions); // Memperbarui nilai questions dengan nilai terbaru
  };

  return (
    <div className="h-full flex flex-col justify-center items-center">
      {onPlay ? (
        <>
          <div className="p-4">
            <QuestionCard
              initialData={currentQuestion}
              questionNumber={questionNumber}
              updateUserAnswer={updateUserAnswer}
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
              className="flex items-center  hover:bg-slate-700 text-white"
              onClick={onNextQuestion}
            >
              {questionNumber === totalQuestion ? 'Kirim' : 'Selanjutnya'}
              <ChevronRight className="h-5 w-5 ml-1" />
            </Button>
          </div>
        </>
      ) : (
        <>
          <GameResult
            imageUrl={game.quiz.imageUrl}
            gamename={game.title}
            result={result!}
          />
        </>
      )}
    </div>
  );
};

export default GameLogic;
