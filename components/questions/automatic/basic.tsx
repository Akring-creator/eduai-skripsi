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
import { Checkbox } from '@/components/ui/checkbox';

interface BasicAutomaticFormProps {
  quizId: string;
}

const formSchema = z.object({
  materi: z.string().max(10000, 'Maksimal 5000 Karakter'),
  numberOfQuestions: z.coerce
    .number()
    .min(1, 'Minimal 1 Pertanyaan')
    .max(10, 'Maksimal 10 Pertanyaan'),
  numberOfOptions: z.coerce.number().min(2, 'Minimal 2').max(5, 'Maksimal 5'),
  guidance: z.string().max(200, 'Maksimal 200 Karakter'),
  questionExample: z.string().default(''),
});

export const BasicAutomaticForm = ({ quizId }: BasicAutomaticFormProps) => {
  const [useCustom, setUseCustom] = useState(false);
  const [useExample, setUseExample] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numberOfOptions: 3,
      numberOfQuestions: 1,
      questionExample: '',
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
    <div className="overflow-auto h-[500px] max-h-screen p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <p className="text-lg font-bold">Materi</p>
          <div className="items-top flex space-x-2">
            <Checkbox
              id="customMaterial"
              checked={useCustom}
              onCheckedChange={() => setUseCustom(!useCustom)}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="customMaterial"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Gunakan materi kustom
              </label>
              <p className="text-sm text-muted-foreground">
                Pakai materi kustom biar soalnya lebih nyambung sama yang kamu
                mau.
              </p>
            </div>
          </div>
          {useCustom ? (
            <FormField
              control={form.control}
              name="materi"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      rows={10}
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
            <div>
              <FormField
                control={form.control}
                name="materi"
                render={({ field }) => (
                  <FormItem>
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
            </div>
          )}

          <FormField
            control={form.control}
            name="guidance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Petunjuk Pembuatan Soal</FormLabel>
                <FormDescription>Mau bikin soal apa nih?</FormDescription>
                <FormControl>
                  <Textarea
                    placeholder="Cth: Soal yang semuanya berupa hitungan"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="items-top flex space-x-2">
            <Checkbox
              id="exampleQuestion"
              checked={useExample}
              onCheckedChange={() => setUseExample(!useExample)}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="exampleQuestion"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Tambah Contoh Soal
              </label>
              <p className="text-sm text-muted-foreground">
                Masukkin contoh soal biar nanti hasilnya lebih sesuai sama yang
                kamu pengen.
              </p>
            </div>
          </div>

          {useExample && (
            <FormField
              control={form.control}
              name="questionExample"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contoh Soal</FormLabel>
                  <FormDescription>
                    kasih contoh soal yang kamu inginkan
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
          <FormField
            control={form.control}
            name="numberOfQuestions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jumlah Pertanyaan</FormLabel>
                <FormDescription>
                  Ada berapa pertanyaan yang ingin kamu buat?
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
                  Mau berapa pilihan jawaban setiap soalnya?
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
              Buatin Soal!
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
