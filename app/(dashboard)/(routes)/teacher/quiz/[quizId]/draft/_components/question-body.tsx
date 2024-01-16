import { useEffect, useState } from 'react';
import QuestionAction from './question-actions';
import QuestionCard from './question-card';
import { Option, Question } from '@prisma/client';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

interface QuestionBodyProps {
  quizId: string;
  initialData: Question & { options: Option[] };
  index: number;
}
export const QuestionBody = ({
  quizId,
  initialData,
  index,
}: QuestionBodyProps) => {
  const [qType, setQType] = useState(initialData.questionType.toString());
  const [isUpdatingQ, setIsUpdating] = useState(false);

  const editQuestionType = (value: string) => {
    setQType(value);
  };
  const onUpdate = (value: boolean) => {
    setIsUpdating(value);
  };

  useEffect(() => {
    const updateQuestionPosition = async () => {
      try {
        await axios.patch(`/api/quiz/${quizId}/questions/${initialData.id}`, {
          position: index,
        });
      } catch (error) {
        // Handle error jika diperlukan
        console.error('Error updating question position:', error);
      }
    };

    updateQuestionPosition();
  }, [index]);

  return (
    <div className="space-y-2 p-4 w-full">
      <div className="font-medium flex items-center justify-between">
        <div className="flex gap-x-2">Pertanyaan {index + 1}</div>

        <QuestionAction
          quizId={quizId}
          initialData={initialData}
          qType={qType}
          onEdit={(value) => editQuestionType(value)}
          onUpdate={(value) => onUpdate(value)}
        />
      </div>

      <div className="relative">
        {isUpdatingQ && (
          <div className="absolute inset-0 bg-slate-500/20 rounded-md flex items-center justify-center">
            <Loader2 className="animate-spin h-10 w-10 text-slate-500" />
          </div>
        )}

        <div
          className={`${isUpdatingQ ? 'cursor-not-allowed' : 'cursor-default'}
           ${isUpdatingQ ? 'opacity-60' : 'opacity-100'}`}
        >
          <QuestionCard
            initialData={initialData}
            quizId={quizId}
            qType={qType}
          />
        </div>
      </div>
    </div>
  );
};
