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
import { Pencil, PlusCircle, Route } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Quiz } from '@prisma/client';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Combobox } from '@/components/ui/combobox';

interface QuizCategoryFormProps {
  initialData: Quiz;
  quizId: string;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  categoryId: z.string().min(1),
});

export const QuizCategoryForm = ({
  initialData,
  quizId,
  options,
}: QuizCategoryFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData?.categoryId || '',
    },
  });
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const update = await axios.patch(`/api/quiz/${quizId}`, values);
      toast.success('Berhasil menambahkan kategori');
      toggleEdit();
      router.refresh();
    } catch {
      toast.error('Terdapat masalah');
    }
    console.log(values);
  };
  const selectedOption = options.find(
    (option) => option.value === initialData.categoryId
  );

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Kategori Kuis
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && initialData.categoryId === null && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Tambah Kategori
            </>
          )}
          {!isEditing && initialData.categoryId !== null && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Kategori
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            'text-sm mt-2',
            !initialData.categoryId && 'text-slate-500 italic'
          )}
        >
          {selectedOption?.label || 'Kategori Tidak Tersedia'}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox options={...options} {...field} />
                  </FormControl>
                  <FormDescription>
                    Ceritakan lebih lanjut tentang kursusmu
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
