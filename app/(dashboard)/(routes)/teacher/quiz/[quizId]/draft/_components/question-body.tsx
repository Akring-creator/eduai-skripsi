import { useState } from 'react';
import QuestionAction from './question-actions';
import QuestionCard from './question-card';
import { Option } from '@prisma/client';
import axios from 'axios';
interface Question {
  id: string;
  question: string;
  imageUrl: string | null;
  answer: string;
  questionType: string;
  explanation: string;
  options: Option[]; // Tambahkan properti options dengan tipe Option[]
  quizId: string;
  position: number;
  createdAt: Date;
  updateAt: Date;
}
interface QuestionBodyProps {
  quizId: string;
  initialData: Question;
  index: number;
}
export const QuestionBody = ({
  quizId,
  initialData,
  index,
}: QuestionBodyProps) => {
  const [qType, setQType] = useState(initialData.questionType);
  const editQuestionType = (value: string) => {
    setQType(value);
  };
  async () => {
    await axios.patch(`/api/quiz/${quizId}/questions/${initialData.id}`, {
      position: index,
    });
  };
  return (
    <div className="space-y-2 p-4 w-full">
      <div className="font-medium flex items-center justify-between">
        <div className="flex gap-x-2">Pertanyaan {index + 1}</div>

        <QuestionAction
          quizId={quizId}
          initialData={initialData}
          qType={qType}
          onEdit={(value) => editQuestionType(value)}
        />
      </div>
      <QuestionCard initialData={initialData} quizId={quizId} qType={qType} />
    </div>
  );
};
