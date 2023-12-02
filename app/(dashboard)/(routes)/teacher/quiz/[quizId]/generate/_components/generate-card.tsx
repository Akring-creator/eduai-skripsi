'use client';

import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface QuizCardProps {
  quizId: string;
}

const formSchema = z.object({
  materi: z
    .string()
    .min(40, 'Minimal 40 Karakter')
    .max(10000, 'Maksimal 5000 Karakter'),
  numberOfQuestions: z.coerce
    .number()
    .min(1, 'Minimal 1 Pertanyaan')
    .max(10, 'Maksimal 10 Pertanyaan'),
  numberOfOptions: z.coerce.number().min(2, 'Minimal 2').max(5, 'Maksimal 5'),
  guidance: z.string().max(200, 'Maksimal 200 Karakter'),
});

export const QuizCard = ({ quizId }: QuizCardProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numberOfOptions: 3,
      numberOfQuestions: 1,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Tahap 1 arahkan ke generator untuk di coba membuat soal
    try {
      const questions = await axios.post(
        `/api/quiz/${quizId}/generator`,
        values
      );
      if (questions.data.length === 0) {
        toast.error('Coba lagi');
      } else {
        console.log(questions.data);
        const updateToDatabase = await axios.post(
          `/api/quiz/${quizId}/questions`,
          questions.data
        );
        toast.success('Soal berhasil dibuat');
        router.push(`/teacher/quiz/${quizId}/draft`);
        router.refresh();
      }
    } catch {
      toast.error('Terdapat masalah');
    }
  }

  const backToQuizHandler = () => {
    router.push(`/teacher/quiz/${quizId}/draft`);
  };

  return (
    <div className="relative bg-slate-100 w-full h-full flex items-center">
      <div className="space-y-2 p-4 ">
        <div className="font-bold text-2xl flex items-center space-x-2">
          <ArrowLeft
            onClick={backToQuizHandler}
            className="h-6 w-6 cursor-pointer hover:opacity-75"
          />

          <span>Buat Soal</span>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-2"
          >
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="materi"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          rows={30}
                          disabled={isSubmitting}
                          placeholder="Masukkan materi yang ingin dibuat soalnya ... "
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-1 space-y-8">
                <FormField
                  control={form.control}
                  name="numberOfQuestions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jumlah Pertanyaan</FormLabel>
                      <FormDescription>
                        Berapa Pertanyaan yang ingin dibuat?
                      </FormDescription>
                      <FormControl>
                        <Input
                          type="number"
                          step="1"
                          placeholder="Min: 1"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numberOfOptions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jumlah Pilihan Jawaban</FormLabel>
                      <FormDescription>
                        Berapa pilihan jawaban pada setiap soal?
                      </FormDescription>
                      <FormControl>
                        <Input
                          type="number"
                          step="1"
                          placeholder="Min: 3"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="guidance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Petunjuk Pembuatan Soal</FormLabel>
                      <FormDescription>
                        Soal seperti apa yang mau kamu buat?
                      </FormDescription>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Cth: Semua soal harus berupa hitungan."
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-x-2">
                  <Button type="submit" disabled={!isValid || isSubmitting}>
                    Buat Soal
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
