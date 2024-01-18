'use client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

import { chapterGenerator } from '@/lib/openai';
import axios from 'axios';
interface Chapter {
  id: string;
  title: string;
  isFinished: boolean;
}

interface Course {
  title: string;
  chapters: Chapter[];
  description: string;
}

export const TestPage = () => {
  const title = 'Hukum Gaya Gesek Kelas XI SMA';
  const chapters = 4;

  const [response, setResponse] = useState('');
  function transformData(originalData: any): Course {
    return {
      title: originalData.title,
      chapters: originalData.chapters.map(
        (chapterTitle: string, index: number) => ({
          id: index.toString(),
          title: chapterTitle,
          isFinished: false,
        })
      ),
      description: originalData.description,
    };
  }

  const onSubmit = async () => {
    // format outputnya JSON atau null
    const data = {
      title: title,
      numOfChapters: chapters,
    };
    const result = await axios.post('/api/courses/chaptergenerator', data);
    console.log(result.data);
    const transform = transformData(result.data);
    console.log(transform);
    setResponse(JSON.stringify(transform) || '');
  };

  return (
    <div>
      <Button onClick={onSubmit}>Klik Disini</Button>
      <div>
        {response !== null ? (
          <div>
            {/* Tampilkan informasi yang Anda perlukan dari respons di sini */}
            {response}
          </div>
        ) : (
          <p>Tidak ada respons saat ini.</p>
        )}
      </div>
    </div>
  );
};

export default TestPage;
