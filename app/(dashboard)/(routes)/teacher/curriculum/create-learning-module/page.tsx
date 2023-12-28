'use client';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import toast from 'react-hot-toast';

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Judul wajib diisi',
  }),
});
const CreatePage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post('/api/curriculum/modul-ajar', values);
      router.push(`/teacher/curriculum/modul-ajar/${response.data.id}`);
      toast.success('Modul Ajar Dibuat');
    } catch {
      toast.error('Terdapat Kendala');
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">Nama Modul Ajar</h1>
        <p>Pertama, kasih nama untuk modul ajar yang ingin kamu buat ya</p>
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
                  <FormLabel>Nama Modul</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="cth: Modul Ajar Kurikulum Merdeka Mata Pelajaran Geografi"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>ini modul ajar tentang apa?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href="/">
                <Button type="button" variant="ghost">
                  Batal
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Lanjut
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePage;
