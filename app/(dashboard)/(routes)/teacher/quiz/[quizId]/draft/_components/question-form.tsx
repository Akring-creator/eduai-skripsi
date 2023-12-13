'use client';

import axios from 'axios';
import { Loader2, Pencil, PlusCircle, Route } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Quiz, Option } from '@prisma/client';
import { cn } from '@/lib/utils';
import { QuestionsList } from './questions-list';

// Cant use Question Format from prisma
interface Question {
  id: string;
  question: string;
  imageUrl: string | null;
  answer: string;
  explanation: string;
  options: Option[]; // Tambahkan properti options dengan tipe Option[]
  quizId: string;
  position: number;
  createdAt: Date;
  updateAt: Date;
}

interface QuestionFormProps {
  initialData: Quiz & { questions: Question[] };
  quizId: string;
}

export const QuestionForm = ({ initialData, quizId }: QuestionFormProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);

      await axios.put(`/api/quiz/${quizId}/questions/reorder`, {
        list: updateData,
      });
      toast.success('Question reordered');
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <div className="relative border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full top-0 right-0 bg-slate-500/20 rouded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-10 w-10 text-sky-700" />
        </div>
      )}
      <div
        className={cn(
          'text-sm mt-2',
          !initialData.questions.length && 'text-slate-500 italic'
        )}
      >
        {!initialData.questions.length && 'Tidak ada Soal'}
        <QuestionsList
          onEdit={() => {}}
          onReorder={onReorder}
          items={initialData.questions}
          quizId={quizId}
        />
      </div>
    </div>
  );
};
