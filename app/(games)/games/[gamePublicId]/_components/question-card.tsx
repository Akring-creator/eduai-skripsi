import { cn } from '@/lib/utils';
import { Option, QuestionType } from '@prisma/client';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import OptionForm from './question-options';
import { ShortAnswer } from './short-answer';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Question {
  selectedOptionId: string | null;
  id: string;
  question: string;
  questionType: QuestionType;
  imageUrl: string | null;
  position: number;
}
interface QuestionCardProps {
  initialData: Pick<
    Question,
    | 'id'
    | 'question'
    | 'questionType'
    | 'imageUrl'
    | 'position'
    | 'selectedOptionId'
  > & { options: Pick<Option, 'id' | 'option'>[] };
  questionNumber: number;
  updateSelectedOption: (optionId: string) => void;
}

const QuestionCard = ({
  initialData,
  questionNumber,
  updateSelectedOption,
}: QuestionCardProps) => {
  const onSelectedOption = (optionId: string) => {
    updateSelectedOption(optionId);
  };
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
                  {option.id === initialData.selectedOptionId ? (
                    <OptionForm
                      option={option}
                      onSelectedOption={onSelectedOption}
                      isSelected={true}
                    />
                  ) : (
                    <OptionForm
                      option={option}
                      onSelectedOption={onSelectedOption}
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
