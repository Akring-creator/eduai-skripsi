'use client';

import { Option, Question } from '@prisma/client';

import { QuestionBody } from './question-body';

interface QuestionsListProps {
  items: (Question & { options: Option[] })[];
}

export const QuestionsList = ({ items }: QuestionsListProps) => {
  return (
    <div>
      {items.map((question, index) => (
        <div
          key={index}
          className="w-full shadow-md mb-4 gap-x-2 bg-white fullwidth"
        >
          <div className="flex items-center  text-slate-700 text-sm">
            <QuestionBody index={index} initialData={question} />
          </div>
        </div>
      ))}
    </div>
  );
};
