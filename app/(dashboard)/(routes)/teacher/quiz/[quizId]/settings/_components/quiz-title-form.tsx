'use client';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil, Route } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// Menyediakan wadah untuk data yang dimasukkan
interface QuizTitleFormProps {
  initialData: { title: string };
  quizId: string;
}

// Menentukan validasi dari form
const formSchema = z.object({
  title: z.string().min(1, {
    message: 'This is Required',
  }),
});
export const QuizTitleForm = (
  // Memasukkan data
  { initialData, quizId }: QuizTitleFormProps
) => {
  // Membuat objek Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  // Membuat objek Router untuk Navigasi
  const router = useRouter();

  // Membuat State sebagai pengecek apakah layout nya sedang dalam tahap editi atau bukan

  const [isEditing, setIsEditing] = useState(false);

  // Membuat fungsi untuk mengubah nilai editing, current menandakan nilai yang sekarang
  const toggleEdit = () => setIsEditing((current) => !current);

  // Mengakses state submit dan valid dari form
  const { isSubmitting, isValid } = form.formState;

  //Membuat fungsi submit ketika pengguna menekan tombol save

  async function onSubmit(
    // values berupa judul dari quiz, karena ditentukan di formSchema di atas
    values: z.infer<typeof formSchema>
  ) {
    try {
      // memanggil fungsi PATCH dari api untuk mengubah judul soal
      const update = await axios.patch(`/api/quiz/${quizId}`, values);

      // Menampilkan pesan ke pengguna
      toast.success('Berhasil mengubah judul');

      // Mengembalikan nilai edit menjadi false
      toggleEdit();

      // merefresh halaman
      router.refresh();
    } catch {
      // Memunculkan pesan error
      toast.error('Terdapat masalah');
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Judul Kuis
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Batal</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Judul
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p className="text-sm mt-2">{initialData.title}</p>}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="cth: Ulangan Harian Kalkulus"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Kuis apa yang mau kamu buat?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Simpan
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
