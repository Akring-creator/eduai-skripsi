'use client';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import toast from 'react-hot-toast';

const ExportPage = ({ params }: { params: { quizId: string } }) => {
  const onClick = async () => {
    try {
      const response = await axios.post(
        `/api/quiz/${params.quizId}/export`,
        {},
        {
          responseType: 'arraybuffer',
          headers: {
            Accept: 'application/octet-stream', // Menetapkan header untuk menerima respons sebagai octet-stream
          },
        }
      );
      1;
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      // Membuat tautan unduh dan klik secara otomatis
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'huhuhuhu.docx');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      toast.success('Kuis Berhasil di Ekspor');
    } catch (error) {
      console.log(error);
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
