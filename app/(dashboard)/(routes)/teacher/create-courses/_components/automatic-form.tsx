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
  const [chapterReview, setChapterReview] = useState(false);
  const [loadingChapterGeneration, setLoadingChapterGenerator] =
    useState(false);
  const [course, setCourse] = useState<Course>(InitialState);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { isSubmitting, isValid } = form.formState;

  function transformData(originalData: any): Course {
    return {
      title: originalData.title,
      chapters: originalData.chapters.map(
        (chapterTitle: string, index: number) => ({
          id: index.toString(),
          title: chapterTitle,
          isFinished: false,
        })
      ),
      description: originalData.description,
    };
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoadingChapterGenerator(true);
      const response = await axios.post(
        '/api/courses/chaptergenerator',
        values
      );
      if (response === null) {
        throw new Error('Terdapat kendala dalam proses chapter generation');
      } else {
        const transformed = transformData(response.data);
        setCourse(transformed);
      }
    } catch (error) {
      console.log('[Chapter Generation]' + error);
      toast.error('Terdapat Kendala');
    } finally {
      setLoadingChapterGenerator(false);
      setChapterReview(true);
    }
  };
  const content =
    !chapterReview && !loadingChapterGeneration ? (
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
                  Untuk pake AI, kami perlu nama dan jumlah chapter di kursusmu
                  ya
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Kursus</FormLabel>
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
                          placeholder="1"
                          disabled={isSubmitting}
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
      </div>
    ) : !chapterReview && loadingChapterGeneration ? (
      <div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center">
            <Image
              src={'/chapter-naming-loading.gif'}
              height={200}
              width={200}
              alt="Import Excel GIF"
            />
            <div className="flex items-center mt-2">
              <Blocks
                height="20"
                width="20"
                color="#0ea4e9"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                visible={true}
              />
              <span className="text-base ml-2">Penamaan Chapter...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    ) : (
      <div>
        <Card>
          <CardHeader className="items-center text-xl font-bold">
            {form.getValues('title')}
          </CardHeader>
          <CardContent>
            <AutomaticChapterForm initialData={course.chapters} />
          </CardContent>
        </Card>
      </div>
    );

  // Assuming you have a LoadingSpinner component to show loading state

  return content;
};
