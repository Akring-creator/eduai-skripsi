'use client';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

const ExportPage = ({ params }: { params: { quizId: string } }) => {
  const [data, setData] = useState('');

  const onClick = async () => {
    try {
      const response = await axios.post(
        `/api/quiz/${params.quizId}/export`,
        {},
        { responseType: 'blob' }
      );

      const blob = response.data;

      // Create a Blob URL
      const blobUrl = window.URL.createObjectURL(blob);

      // Create a link element
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'YourFileName.docx';

      // Append the link to the body
      document.body.appendChild(link);

      // Trigger a click on the link
      link.click();

      // Remove the link from the body
      document.body.removeChild(link);

      // Revoke the Blob URL to free up resources
      window.URL.revokeObjectURL(blobUrl);

      // Update state or perform other actions if needed
      setData('Export successful');
      toast.success('Quiz successfully exported');
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while exporting the quiz');
    }
  };

  return (
    <div>
      <Button variant="outline" onClick={onClick}>
        Click Here!
      </Button>
      <div>{data}</div>
    </div>
  );
};

export default ExportPage;
