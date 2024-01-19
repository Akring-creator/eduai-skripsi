'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { getTranscript, searchYoutube } from '@/lib/youtube';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { BadgeCheck, Loader2, PlusCircle, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

interface Chapter {
  id: string;
  title: string;
  isFinished: boolean;
  description: string | null;
  videoUrl: string | null;
  videoType: string | null;
}

interface Course {
  title: string;
  chapters: Chapter[];
  description: string;
}
interface AutomaticChapterFormProps {
  initialData: Course;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required',
  }),
});

export const AutomaticChapterForm = ({
  initialData,
}: AutomaticChapterFormProps) => {
  const router = useRouter();
  const [chapters, setChapters] = useState<Chapter[]>(initialData.chapters);
  const [isAdding, setIsAdding] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  useEffect(() => {
    console.log(chapters);
  }, [chapters]);

  const toggleAdding = () => setIsAdding((current) => !current);

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const newValue = {
      id: chapters.length.toString(),
      title: values.title,
      isFinished: false,
      description: null,
      videoUrl: null,
      videoType: null,
    };
    try {
      setChapters((prev) => [...prev, newValue]);
      toggleAdding();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Terdapat kendala');
    }
  };
  const onDelete = (idToDelete: string) => {
    const updatedChapters = chapters.filter(
      (chapter) => chapter.id !== idToDelete
    );
    setChapters(updatedChapters);
  };

  const fetchVideo = async () => {
    const updatedChapters = [];
    try {
      const copyChapters = chapters.slice();

      for (const chapter of copyChapters) {
        const newChapter = await axios.post(
          '/api/courses/automatic/video',
          chapter
        );

        setChapters((prevData) =>
          prevData.map((item) =>
            item.id === chapter.id ? { ...item, isFinished: true } : item
          )
        );

        updatedChapters.push(newChapter.data);
      }

      // Update state after all iterations are complete
      setChapters(updatedChapters);
    } catch (error) {
      console.error('[COURSE_CREATION]', error);
      toast.error('Terdapat Kendala saat membuat video chapter');
    } finally {
      return updatedChapters;
    }
  };

  const courseGeneration = async (updatedChapters: Chapter[]) => {
    try {
      const course = await axios.post('/api/courses', {
        title: initialData.title,
      });
      const description = await axios.patch(`/api/courses/${course.data.id}`, {
        description: initialData.description || '',
      });

      // Upload chapters asynchronously
      const chapterUploadPromises = updatedChapters.map(
        async (chapter, index) => {
          console.log(
            'ini Link YT Chapter ' + chapter.title + ' = ' + chapter.videoUrl
          );
          const data = {
            title: chapter.title,
            description: chapter.description,
            videoUrl: chapter.videoUrl,
            videoType: chapter.videoType,
            position: index,
          };

          await axios.post(`/api/courses/${course.data.id}/chapters`, data);
        }
      );

      await Promise.all(chapterUploadPromises);

      toast.success('Kursus berhasil dibuat');
      return course.data.id;
    } catch (error) {
      console.error('[COURSE_CREATION]', error);
      toast.error('Terdapat Kendala saat membuat kursus');
      return null; // Return null in case of an error
    }
  };

  const createCourse = async () => {
    setIsCreating(true);
    const updatedChapters = await fetchVideo();
    const courseId = await courseGeneration(updatedChapters);

    if (courseId !== null) {
      router.push(`/teacher/courses/${courseId}`);
    }
    setIsCreating(false);
  };

  return (
    <>
      <div className="mt-2 border bg-slate-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between text-sm">
          Rencana Chapter
          <Button onClick={toggleAdding} variant="ghost">
            {isAdding && <>Batal</>}
            {!isAdding && (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
              </>
            )}
          </Button>
        </div>
        <div className="overflow-auto h-[200px] max-h-screen">
          {isAdding && (
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
                          placeholder="cth: Pengenalan Kursus"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  size="sm"
                  type="submit"
                  disabled={!isValid || isSubmitting}
                >
                  Tambah
                </Button>
              </form>
            </Form>
          )}
          {!isAdding && (
            <div className="text-sm mt-2 text-slate-500 italic">
              {!chapters.length && 'Terdapat Kendala'}
              <div>
                {chapters.map((chapter, index) => (
                  <div
                    key={index} // Tambahkan key prop untuk setiap item dalam map
                    className={cn(
                      'flex items-center gap-x-2 bg-slate-200 border-slate border text-slate-700 rounded-md mb-4 text-sm',
                      chapter.isFinished &&
                        'bg-sky-100 border-sky-200 text-sky-700'
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <p className="text-xs ml-2 p-1">{chapter.title}</p>
                      <div className="flex items-center space-x-2">
                        {chapters.length > 1 &&
                          !isCreating &&
                          !chapter.isFinished && (
                            <Trash
                              className="h-3 w-3 mr-2 text-red-500 hover:cursor-pointer"
                              onClick={() => onDelete(chapter.id)}
                              key={chapter.id} // tambahkan kunci key jika menggunakan komponen dalam loop
                            />
                          )}
                        {isCreating && !chapter.isFinished && (
                          <Loader2 className="animate-spin h-3 w-3 mr-2 text-sky-500" />
                        )}
                        {isCreating && chapter.isFinished && (
                          <BadgeCheck className=" h-3 w-3 mr-2 text-sky-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {!isAdding && (
          <p className="text-xs text-muted-foreground mt-4">
            Powered By OpenAI
          </p>
        )}
      </div>
      <div className="flex items-center p-2">
        <Button
          variant="outline"
          className="mx-auto"
          disabled={isCreating}
          onClick={createCourse}
        >
          <p> Buat Kursus &nbsp;</p>

          {isCreating && (
            <Loader2 className="animate-spin h-3 w-3 mr-2 text-slate-500" />
          )}
        </Button>
      </div>
    </>
  );
};
