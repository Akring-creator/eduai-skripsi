import { cn } from '@/lib/utils';
import { Option, QuestionType } from '@prisma/client';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import OptionForm from './question-options';
import { ShortAnswer } from './short-answer';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Question {
  userAnswer: string | null;
  correctAnswer: string | null;
  id: string;
  question: string;
  questionType: QuestionType;
  imageUrl: string | null;
  position: number;
}
interface QuestionCardProps {
  initialData: Pick<
    Question,
    'id' | 'question' | 'questionType' | 'imageUrl' | 'position' | 'userAnswer'
  > & { options: Pick<Option, 'id' | 'option'>[] };
  questionNumber: number;
  updateUserAnswer: (value: string) => void;
}

const QuestionCard = ({
  initialData,
  questionNumber,
  updateUserAnswer,
}: QuestionCardProps) => {
  return (
    <Card className="mx-20">
      <CardHeader>
        <CardTitle>Soal {questionNumber}</CardTitle>
      </CardHeader>
      <CardContent>
        {initialData.question}
        <div className="max-h-full opacity-100">
          {initialData.questionType === 'multipleChoice' ? (
            <div>
              {initialData.options.map((option, index) => (
                <div key={option.id}>
                  {option.id === initialData.userAnswer ? (
                    <OptionForm
                      option={option}
                      onUpdateUserAnswer={updateUserAnswer}
                      isSelected={true}
                    />
                  ) : (
                    <OptionForm
                      option={option}
                      onUpdateUserAnswer={updateUserAnswer}
                      isSelected={false}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : initialData.questionType === 'shortAnswer' ? (
            <div>
              <Input />
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
