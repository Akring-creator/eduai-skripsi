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
const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is Required',
  }),
  price: z.coerce.number(),
});
export const ManualForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      price: 0,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post('/api/courses', values);
      router.push(`/teacher/courses/${response.data.id}`);
      toast.success('Kursus berhasil dibuat');
    } catch {
      toast.error('Terdapat kendala');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 mt-2">
        <Card>
          <CardHeader>
            <CardTitle>Identitas Kursus</CardTitle>
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
