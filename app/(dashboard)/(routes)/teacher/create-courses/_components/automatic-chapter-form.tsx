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
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

interface TempChapter {
  id: string;
  title: string;
  isFinished: boolean;
}
interface AutomaticChapterFormProps {
  initialData: TempChapter[];
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required',
  }),
});

export const AutomaticChapterForm = ({
  initialData,
}: AutomaticChapterFormProps) => {
  const [chapters, setChapters] = useState(initialData);
  const [isCreating, setIsCreating] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  // useEffect(() => {}, [chapters]);

  const toggleCreating = () => setIsCreating((current) => !current);

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const position = chapters.length;
    const newValue = {
      id: position.toString(),
      title: values.title,
      position: position,
      isFinished: false,
    };
    try {
      setChapters((prev) => [...prev, newValue]);
      toggleCreating();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Terdapat kendala');
    }
  };
  const onDelete = async (idToDelete: string) => {
    try {
      // Filter array chapters untuk menyertakan semua item kecuali yang memiliki idToDelete
      const updatedChapters = chapters.filter(
        (chapter) => chapter.id !== idToDelete
      );

      // Setelah membuat array baru tanpa item yang dihapus, update state
      setChapters(updatedChapters);
    } catch {
      toast.error('Terdapat Kendala');
    } finally {
      // Kode yang dijalankan setelah try atau catch selesai
    }
  };

  return (
    <>
      <div className="mt-6 border bg-slate-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between text-sm">
          Rencana Chapter
          <Button onClick={toggleCreating} variant="ghost">
            {isCreating && <>Batal</>}
            {!isCreating && (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
              </>
            )}
          </Button>
        </div>
        <div className="overflow-auto h-[200px] max-h-screen">
          {isCreating && (
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
          {!isCreating && (
            <div className="text-sm mt-2 text-slate-500 italic">
              {!chapters.length && 'T'}
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
                        {/* Jarak antara text dan icon trash dapat diatur dengan menambahkan space-x pada parent div */}
                        {chapters.length > 1 && (
                          <Trash
                            className="h-3 w-3 mr-2 text-red-500 hover:cursor-pointer"
                            onClick={() => onDelete(chapter.id)}
                            key={chapter.id} // tambahkan kunci key jika menggunakan komponen dalam loop
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {!isCreating && (
          <p className="text-xs text-muted-foreground mt-4">
            Powered By OpenAI
          </p>
        )}
      </div>
      <div className="flex items-center p-2">
        <Button variant="outline" className="mx-auto">
          Buat Kursus
        </Button>
      </div>
    </>
  );
};
