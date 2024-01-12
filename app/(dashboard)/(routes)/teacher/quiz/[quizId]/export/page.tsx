'use client';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import toast from 'react-hot-toast';

const ExportPage = ({ params }: { params: { quizId: string } }) => {
  const onClick = async () => {
    try {
      await axios.post(`/api/quiz/${params.quizId}/export`);
      toast.success('Kuis Berhasil di Ekspor');
    } catch (error) {
      toast.error('Terdapat Kendala');
    }
  };
  return (
    <div>
      <Button variant="outline" onClick={onClick}>
        Click Here!
      </Button>
    </div>
  );
};

export default ExportPage;
