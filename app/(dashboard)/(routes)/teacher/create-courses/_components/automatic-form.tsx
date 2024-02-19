'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Blocks } from 'react-loader-spinner';
import Image from 'next/image';

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
import { AutomaticChapterForm } from './automatic-chapter-form';
import LoadingScreen from '@/components/loading-screen';
const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Oops kursusmu wajib punya nama',
  }),
  numberOfChapter: z.coerce.number().min(1, {
    message: 'Minimal harus ada 1 chapter ya.',
  }),
});
interface Chapter {
  id: string;
  title: string;
  isFinished: boolean;
  description: string;
  videoUrl: string;
  videoType: string;
}

interface Course {
  title: string;
  chapters: Chapter[];
  description: string;
}
const InitialState: Course = {
  title: '',
  chapters: [],
  description: '',
};

export const AutomaticForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { isSubmitting, isValid } = form.formState;
  const [chapterReview, setChapterReview] = useState(false);
  const [loadingChapterGeneration, setLoadingChapterGeneration] =
    useState(false);
  const [course, setCourse] = useState<Course>(InitialState);

  const loadingSentences = [
    'Mempersiapkan materi pembelajaran terbaru...',
    'Menyiapkan chapter baru untukmu...',
    'Mencari video pembelajaran yang relevan...',
    'Menambahkan referensi pembelajaran...',
  ];

  function transformData(originalData: any): Course {
    return {
      title: originalData.title,
      chapters: originalData.chapters.map(
        (chapterTitle: string, index: number) => ({
          id: index.toString(),
          title: chapterTitle,
          isFinished: false,
          description: '',
          videoUrl: '',
          videoType: '',
        })
      ),
      description: originalData.description,
    };
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoadingChapterGeneration(true);
      const response = await axios.post('/api/courses/automatic/title', values);

      // Check for errors more accurately
      if (
        !response.data ||
        !response.data.chapters ||
        response.data.chapters.length === 0
      ) {
        throw new Error('Terdapat kendala dalam proses chapter generation');
      } else {
        const transformed = transformData(response.data);
        setCourse(transformed);

        setChapterReview(true);
      }
    } catch (error) {
      console.log('[Chapter Generation]', error);
      toast.error('Terdapat Kendala');
    } finally {
      setLoadingChapterGeneration(false);
    }
  };
  const content = (
    <div>
      {!chapterReview && !loadingChapterGeneration && (
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-2 mt-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Identitas Kursus</CardTitle>
                  <CardDescription>
                    Untuk pake AI, kami perlu konten yang diinginkan dan jumlah
                    chapter di kursusmu ya
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rencana Konten</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isSubmitting}
                            placeholder="cth: Hukum Gravitasi Kelas X"
                            {...field}
                          />
                        </FormControl>
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
                            placeholder="1"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
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
        </div>
      )}

      {!chapterReview && loadingChapterGeneration && (
        <LoadingScreen
          imgUrl="/chapter-naming-loading.gif"
          imgHeight={200}
          imgWidth={200}
          loaderSize={20}
          sentences={loadingSentences}
        />
      )}

      {chapterReview && !loadingChapterGeneration && (
        <div>
          <Card>
            <CardHeader className="items-center text-xl font-bold">
              {form.getValues('title')}
            </CardHeader>
            <CardContent>
              <AutomaticChapterForm initialData={course} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  return content;
};
