'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useState } from 'react';
const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Oops kursusmu wajib punya nama',
  }),
  numberOfChapter: z.coerce.number().min(1, {
    message: 'Minimal harus ada 1 chapter ya.',
  }),
});
export const AutomaticForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post('/api/courses', values);
      router.push(`/teacher/courses/${response.data.id}`);
      toast.success('Kursus berhasil dibuat');
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 mt-2">
        <Card>
          <CardHeader>
            <CardTitle>Nama Kursus</CardTitle>
            <CardDescription>
              Kasih nama kursusmu, tenang nanti bisa diganti kok.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul Kursus</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="cth: Geografi Manusia"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Apa yang ingin kamu ajarkan?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numberOfChapter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Chapter</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="1"
                      min={1}
                      disabled={isSubmitting}
                      placeholder="Banyaknya chapter"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Jumlah chapternya mau berapa ya?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
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
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
