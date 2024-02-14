import { Option, Question } from '@prisma/client';
import QuestionAction from './question-actions';
import QuestionCard from './question-card';

interface QuestionBodyProps {
  initialData: Question & { options: Option[] };
  index: number;
}
export const QuestionBody = ({ initialData, index }: QuestionBodyProps) => {
  return (
    <div className="space-y-2 p-4 w-full">
      <div className="font-medium flex items-center justify-between">
        <div className="flex gap-x-2">Pertanyaan {index + 1}</div>

        <QuestionAction initialData={initialData} />
      </div>

      <div className="relative">
        <QuestionCard initialData={initialData} />
      </div>
    </div>
  );
};
