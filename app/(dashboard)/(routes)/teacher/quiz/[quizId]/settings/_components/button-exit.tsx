'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface FinishButtonProps {
  quizId: string;
}
export const FinishButton = ({ quizId }: FinishButtonProps) => {
  const router = useRouter();

  // Fungsi On Submit untuk mengalihkan ke halaman Quiz

  function onClick() {
    router.push(`/teacher/quiz/${quizId}/draft`);
  }
  return (
    <div className="mt-2">
      <Button onClick={onClick}> Selesai </Button>
    </div>
  );
};
