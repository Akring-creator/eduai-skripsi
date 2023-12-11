'use client';

import { ConfirmModal } from '@/components/modals/confirm-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface QuestionActionsProps {
  quizId: string;
  questionId: string;
}

const QuestionAction = ({ quizId, questionId }: QuestionActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/quiz/${quizId}/questions/${questionId}`);
      toast.success('Soal dihapus');
      router.refresh();
    } catch {
      toast.error('Terdapat Kendala');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className=" flex items-center gap-x-2">
      <Badge className="bg-sky-700">Pilihan Ganda</Badge>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading} variant="outline">
          <Trash className="w-4 h-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default QuestionAction;
