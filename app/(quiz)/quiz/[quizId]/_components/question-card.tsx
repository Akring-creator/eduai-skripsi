import { cn } from '@/lib/utils';
import { Option, Question } from '@prisma/client';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import OptionForm from './question-options';
import { ShortAnswer } from './short-answer';

interface QuestionCardProps {
  initialData: Question & { options: Option[] };
}

const QuestionCard = ({ initialData }: QuestionCardProps) => {
  const [showAllQuestionSection, setShowAllQuestionSection] = useState(false);
  const toggleShowAllQuestionSection = () => {
    setShowAllQuestionSection(!showAllQuestionSection);
  };
  const correctAnswer = initialData.options.find(
    (option) => option.isKeyAnswer === true
  );

  return (
    <div className="p-2">
      <div className="flex items-center justify-between w-90">
        <div className="text-xl mb-4 w-full">
          <div className="outline-none font-bold ">{initialData.question}</div>
        </div>
        <div
          onClick={toggleShowAllQuestionSection}
          className={cn(
            'w-6 text-slate-500 hover:opacity-70 cursor-pointer',
            showAllQuestionSection && 'text-sky-700'
          )}
        >
          {showAllQuestionSection ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>
      <div
        className={`transition-all ${
          showAllQuestionSection
            ? 'max-h-full opacity-100'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        {initialData.questionType === 'multipleChoice' ? (
          <div>
            {initialData.options.map((option, index) => (
              <div key={index}>
                <OptionForm option={option} />
              </div>
            ))}
          </div>
        ) : initialData.questionType === 'shortAnswer' ? (
          <div>
            <ShortAnswer option={correctAnswer!} />
          </div>
        ) : null}

        <div
          className={cn(
            'p-2 mt-2 text-sm',
            initialData.questionType === 'longAnswer' && 'text-base'
          )}
        >
          <p className="font-bold">
            {initialData.questionType === 'longAnswer'
              ? 'Jawaban:'
              : 'Pembahasan:'}
          </p>

          <div className="mb-4 w-full">
            <div className="outline-none">{initialData.explanation}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
