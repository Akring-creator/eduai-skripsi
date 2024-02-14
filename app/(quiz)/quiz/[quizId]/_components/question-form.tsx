'use client';

import { cn } from '@/lib/utils';
import { Option, Question, Quiz } from '@prisma/client';
import { QuestionsList } from './questions-list';

interface QuestionFormProps {
  initialData: Quiz & { questions: (Question & { options: Option[] })[] };
}

export const QuestionForm = ({ initialData }: QuestionFormProps) => {
  return (
    <div className="relative border bg-slate-100 rounded-md p-4">
      <div
        className={cn(
          'text-sm mt-2',
          !initialData.questions.length && 'text-slate-500 italic'
        )}
      >
        {!initialData.questions.length && 'Tidak ada Soal'}
        <QuestionsList items={initialData.questions} />
      </div>
    </div>
  );
};
