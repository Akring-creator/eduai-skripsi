'use client';
import { DialogFooter } from '@/components/ui/dialog';
import { Badge, BadgeCheckIcon, Trash } from 'lucide-react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface BasicQuestionManualFormProps {
  quizId: String;
}

const questionSchema = z.object({
  question: z.string().min(10).max(10000),
  explanation: z.string().min(50),
  answer: z.string(),
  options: z.array(z.string()),
  isPublihed: z.boolean().default(true),
});

export const BasicQuestionManualForm = ({
  quizId,
}: BasicQuestionManualFormProps) => {
  const [numOfOptions, setNumofoptions] = useState(3);
  const [options, setOptions] = useState(Array.from({ length: 3 }, () => ''));
  const [keyAnswerIndex, setKeyAnswerIndex] = useState(-1);
  const [question, setQuestion] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();

  const addOption = () => {
    setNumofoptions(numOfOptions + 1);
    setOptions([...options, '']);
  };
  const optionUpdateHandler = (index: number, event: any) => {
    const newOptions = [...options];
    newOptions[index] = event.target.value;
    setOptions(newOptions);
  };
  const updateQuestionHandler = (event: any) => {
    const newQuestion = event.target.value;
    setQuestion(newQuestion);
  };
  const updateExplanationHandler = (event: any) => {
    const newExplanation = event.target.value;
    setExplanation(newExplanation);
  };
  const optionDeleteHandler = (index: number) => {
    if (numOfOptions > 1) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
      setNumofoptions(numOfOptions - 1);
      if (keyAnswerIndex === index) {
        setKeyAnswerIndex(-1);
      }
    }
  };

  const keyAnswerIndexHandler = (index: number) => {
    setKeyAnswerIndex(index === keyAnswerIndex ? -1 : index);
  };

  const inputValidation = () => {
    if (options.length > 1 && keyAnswerIndex === -1) {
      toast.error('Pilih kunci jawaban');
      return false;
    } else {
      let answer = '';
      if (options.length === 1) {
        answer = options[0];
      } else {
        answer = options[keyAnswerIndex];
      }
      const data = {
        question: question,
        explanation: explanation,
        answer: answer,
        options: options,
      };
      return data;
    }
  };
  const addQuestion = async () => {
    const data = inputValidation();
    if (data !== false) {
      try {
        const completeData = [questionSchema.parse(data)];
        setIsUploading(true);
        await axios.post(
          `/api/quiz/${quizId}/questions/multiple-choice`,
          completeData
        );
        toast.success('Soal ditambahkan');
        //Set everything to default
        setExplanation('');
        setQuestion('');
        setOptions(Array.from({ length: 3 }, () => ''));
        setNumofoptions(3);
        setKeyAnswerIndex(-1);

        router.refresh();
      } catch (error) {
        console.log(error);
      } finally {
        setIsUploading(false);
      }
    }
  };
  return (
    <>
      <Label>Pertanyaan:</Label>
      <Textarea value={question} onChange={(e) => updateQuestionHandler(e)} />
      <Label>Pilihan Jawaban</Label>
      {[...Array(numOfOptions)].map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between space-x-2 mb-1"
        >
          <Input
            value={options[index]}
            onChange={(e) => optionUpdateHandler(index, e)}
          />

          {numOfOptions > 1 && (
            <div className="flex items-center space-x-2">
              <div
                className={cn(
                  'ml-2 h-6 w-6 text-slate-500 hover:cursor-pointer',
                  index === keyAnswerIndex && 'text-sky-700'
                )}
                onClick={() => keyAnswerIndexHandler(index)}
              >
                {index === keyAnswerIndex ? <BadgeCheckIcon /> : <Badge />}
              </div>
              <Trash
                className="h-5 w-5 text-red-500 hover:cursor-pointer hover:opacity-70"
                onClick={() => optionDeleteHandler(index)}
              />
            </div>
          )}
        </div>
      ))}
      <Button variant="outline" onClick={addOption}>
        Tambah Pilihan Jawaban
      </Button>
      <Label>Penjelasan</Label>
      <Textarea
        value={explanation}
        onChange={(e) => updateExplanationHandler(e)}
        placeholder="Jelaskan penjabaran dari jawaban yang benar minimal 50 karakter"
      />

      <DialogFooter>
        <Button onClick={addQuestion} type="submit" disabled={isUploading}>
          Tambah Soal
        </Button>
      </DialogFooter>
    </>
  );
};
