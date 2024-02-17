import { cn } from '@/lib/utils';
import { Option, Question } from '@prisma/client';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import OptionForm from './question-options';
import { ShortAnswer } from './short-answer';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuestionCardProps {
  initialData: Question & { options: Pick<Option, 'id' | 'option'>[] };
  questionNumber: number;
}

const QuestionCard = ({ initialData, questionNumber }: QuestionCardProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const onSelectedOption = (optionId: string) => {
    setSelectedOption(optionId);
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
                  {option.id === selectedOption ? (
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
