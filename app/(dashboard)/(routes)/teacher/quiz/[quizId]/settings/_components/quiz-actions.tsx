'use client';

import { ConfirmModal } from '@/components/modals/confirm-modal';
import { Button } from '@/components/ui/button';
import { useConfettiStore } from '@/hooks/use-confetti-store';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface QuizActionsProps {
  quizId: string;
  disable: boolean;
  isPublished: boolean;
}
export const QuizActions = ({
  quizId,
  disable,
  isPublished,
}: QuizActionsProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);
  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(`/api/quiz/${quizId}/unpublish`);
        toast.success('Kuis Dipublikasikan');
      } else {
        await axios.patch(`/api/quiz/${quizId}/publish`);
        toast.success('Kuis Diprivat');
        confetti.onOpen();
      }

      router.refresh();
    } catch (error) {
      toast.error('Terdapat Kendala');
    } finally {
      setIsLoading(false);
    }
  };
  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/quiz/${quizId}`);
      toast.success('Course Dihapus');
      // router.refresh();
      router.push(`/teacher/quiz`);
    } catch {
      toast.error('Terdapat Kendala');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center gap-x-2">
      <Button onClick={onClick} disabled={disable || isLoading} size="sm">
        {isPublished ? 'Buat Privat' : 'Buat Publik'}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading} variant="outline">
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
