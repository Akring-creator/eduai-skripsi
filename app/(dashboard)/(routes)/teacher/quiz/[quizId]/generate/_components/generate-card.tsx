'use client';

import { z } from 'zod';
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
import Link from 'next/link';
import { useState } from 'react';

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
  questionExample: z.string().default(''),
});

export const QuizCard = ({ quizId }: QuizCardProps) => {
  const [useCustom, setUseCustom] = useState(false);
  const [useExample, setUseExample] = useState(false);
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
      console.log(questions);
      if (questions.data.length === 0) {
        toast.error('Coba lagi');
      } else {
        await axios.post(
          `/api/quiz/${quizId}/questions/multiple-choice`,
          questions.data
        );
        toast.success('Soal ditambahkan');
        router.push(`/teacher/quiz/${quizId}/draft`);
        router.refresh();
      }
    } catch {
      toast.error('Terdapat masalah');
    }
  }

  return (
    <div className="relative bg-slate-100 w-full h-full flex items-center">
      <div className="space-y-2 p-4 ">
        <Link
          href={`/teacher/quiz/${quizId}/draft`}
          className="flex items-center text-sm hover:opacity-75 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Kuis
        </Link>
        <div className="font-bold text-2xl flex items-center space-x-2">
          Pembuatan Soal
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-2"
          >
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-4">
                {useCustom ? (
                  <FormField
                    control={form.control}
                    name="materi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Materi Soal</FormLabel>
                        <FormDescription>
                          Masukkan materimu disini
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            rows={20}
                            disabled={isSubmitting}
                            placeholder="Cth: Atmosfer Inc merupakan sebuah perusahaan pionir di bidang energi terbarukan yang berkomitmen untuk menciptakan solusi inovatif demi memperkuat keberlanjutan lingkungan. Didirikan dengan visi memimpin perubahan menuju sumber daya energi yang berkelanjutan, perusahaan ini menggabungkan penelitian dan pengembangan terkini untuk menciptakan teknologi canggih, termasuk panel surya mutakhir, turbin angin efisien, dan sistem penyimpanan energi ramah lingkungan. Tim profesional Atmosfer Inc, yang terdiri dari insinyur, ilmuwan, dan ahli industri, bekerja bersama-sama untuk merancang solusi energi bersih yang dapat diandalkan dan efisien."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="materi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Materi Soal</FormLabel>
                        <FormDescription>
                          Materi apa yang ingin dibuat soalnya
                        </FormDescription>
                        <FormControl>
                          <Input
                            disabled={isSubmitting}
                            placeholder="Cth: Dinamika Atmosfer kelas X"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

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
                        <Textarea
                          placeholder="Cth: Semua soal harus berupa hitungan."
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {useExample && (
                  <FormField
                    control={form.control}
                    name="questionExample"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contoh Soal</FormLabel>
                        <FormDescription>
                          Berikan contoh soal yang ingin kamu buat!
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            placeholder="Masukkan contoh soalmu disini!"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
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
