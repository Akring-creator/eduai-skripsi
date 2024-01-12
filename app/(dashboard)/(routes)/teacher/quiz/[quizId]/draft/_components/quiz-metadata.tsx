'use client';
import { z } from 'zod';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Option, Question, Quiz } from '@prisma/client';
import {
  Badge,
  BadgeCheckIcon,
  Bot,
  GripVertical,
  Pencil,
  Settings,
  Trash,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import axios from 'axios';
import toast from 'react-hot-toast';

interface MetadataProps {
  initialData: Quiz & { questions: (Question & { options: Option[] })[] };
}
const questionSchema = z.object({
  question: z.string().min(10).max(10000),
  explanation: z.string().min(50),
  answer: z.string().min(10),
  options: z.array(z.string()),
  isPublihed: z.boolean().default(true),
});

export const Metadata = ({ initialData }: MetadataProps) => {
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

  const addQuestion = async () => {
    const data = {
      question: question,
      explanation: explanation,
      answer: 'Apakah ini jawaban yang benar',
      options: ['Apakah ini jawaban yang benar', 'B', 'C'],
    };

    try {
      console.log(data);
      const parseData = questionSchema.parse(data);
      const completeData = [];
      completeData.push(parseData);
      console.log(completeData);
      setIsUploading(true);
      await axios.post(
        `/api/quiz/${initialData.id}/questions/multiple-choice`,
        completeData
      );
      console.log;
      toast.success('Soal ditambahkan');
      router.push(`/teacher/quiz/${initialData.id}/draft`);
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="relative">
        <div className="bg-slate-100 border p-4 mb-2 rounded flex items-center justify-between">
          <div className="flex items-start">
            <img
              src={
                initialData.imageUrl
                  ? initialData.imageUrl
                  : 'https://uploadthing.com/f/d02b1c91-dd8b-4caf-a629-199f39f3662f-9lxp8g.png'
              }
              alt="Gambar"
              className="w-40 h-40 rounded mr-4"
            />
            <div className="bg-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold mb-2">
                  {initialData.title}
                </h2>
              </div>
              <p className="text-gray-700 text-sm">
                {initialData.description
                  ? initialData.description
                  : 'Tidak Ada Deskripsi'}
              </p>

              <span className="text-sm text-slate-700">
                Terakhir diubah:{' '}
                {initialData.updateAt.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Bagian 2 */}
          <div className="absolute top-0 right-0 flex items-start gap-x-3 mt-2 mr-2">
            <div>
              <Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <GripVertical className="h-5 w-5 p-0 hover:cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        Tambah Soal
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DialogTrigger>
                          <DropdownMenuItem>
                            <Pencil className="h-5 w-5 mr-2" />
                            Manual
                          </DropdownMenuItem>
                        </DialogTrigger>

                        <Link href={`/teacher/quiz/${initialData.id}/generate`}>
                          <DropdownMenuItem>
                            <Bot className="h-5 w-5 mr-2" />
                            Dengan AI
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator></DropdownMenuSeparator>
                    <DropdownMenuItem>
                      <Link href={`/teacher/quiz/${initialData.id}/settings`}>
                        <DropdownMenuItem>
                          <Settings className="h-5 w-5 mr-2" />
                          Pengaturan
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuItem>

                    {/* <Link href={`/teacher/quiz/${initialData.id}/export`}>
                    <DropdownMenuItem>
                      <ArrowRightToLine className="h-5 w-5 mr-2" />
                      Ekspor Kuis
                    </DropdownMenuItem>
                  </Link> */}
                  </DropdownMenuContent>
                </DropdownMenu>
                <DialogPortal>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Tambah Soal Manual</DialogTitle>
                    </DialogHeader>
                    <Label>Pertanyaan:</Label>
                    <Textarea
                      value={question}
                      onChange={(e) => updateQuestionHandler(e)}
                    />
                    <Label>Pilihan Jawaban</Label>
                    {[...Array(numOfOptions)].map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between space-x-2"
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
                              {index === keyAnswerIndex ? (
                                <BadgeCheckIcon />
                              ) : (
                                <Badge />
                              )}
                            </div>
                            <Trash
                              className="h-5 w-5 text-red-500 hover:cursor-pointer hover:opacity-70"
                              onClick={() => optionDeleteHandler(index)}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                    <Button variant="ghost" onClick={addOption}>
                      Tambah Pilihan Jawaban
                    </Button>
                    <Label>Penjelasan</Label>
                    <Textarea
                      value={explanation}
                      onChange={(e) => updateExplanationHandler(e)}
                      placeholder="Jelaskan penjabaran dari jawaban yang benar minimal 50 karakter"
                    />

                    <DialogFooter>
                      <Button
                        onClick={addQuestion}
                        type="submit"
                        disabled={isUploading}
                      >
                        Tambah Soal
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </DialogPortal>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
