'use client';

import { Badge } from '@/components/ui/badge';

import { Option, Question } from '@prisma/client';

interface QuestionActionsProps {
  initialData: Question & { options: Option[] };
}

const QuestionAction = ({ initialData }: QuestionActionsProps) => {
  return (
    <div className="flex items-center gap-x-2">
      {initialData.questionType === 'multipleChoice' ? (
        <Badge className="bg-sky-700">Pilihan Ganda</Badge>
      ) : initialData.questionType === 'shortAnswer' ? (
        <Badge className="bg-emerald-700">Isian Singkat</Badge>
      ) : initialData.questionType === 'longAnswer' ? (
        <Badge className="bg-fuchsia-700">Uraian</Badge>
      ) : null}
    </div>
  );
};

export default QuestionAction;
