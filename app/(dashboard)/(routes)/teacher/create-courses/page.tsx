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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Label } from '@/components/ui/label';
import { Bot, Pencil } from 'lucide-react';
const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is Required',
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
      const response = await axios.post('/api/courses', values);
      router.push(`/teacher/courses/${response.data.id}`);
      toast.success('Kursus berhasil dibuat');
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <Tabs defaultValue="manual" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">
            <div className="flex items-center">
              <p className="mr-2">Manual</p>
              <Pencil className="h-3 w-3" />
            </div>
          </TabsTrigger>
          <TabsTrigger value="ai">
            <div className="flex items-center">
              <p className="mr-2">Dengan AI</p>
              <Bot className="h-3 w-3" />
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Nama Kursus</CardTitle>
              <CardDescription>
                Kasih nama kursusmu, tenang nanti bisa diganti kok.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-2 mt-2"
                >
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
                </form>
              </Form>
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
        </TabsContent>
        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>Nama Kursus</CardTitle>
              <CardDescription>
                Kasih nama kursusmu, tenang nanti bisa diganti kok.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-2 mt-2"
                >
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
                </form>
              </Form>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatePage;
