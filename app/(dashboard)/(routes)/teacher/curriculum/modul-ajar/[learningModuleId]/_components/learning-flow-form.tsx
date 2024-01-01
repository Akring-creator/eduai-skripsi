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
import { Loader2, Pencil, PlusCircle, Route } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { LearningFlow, LearningModule } from '@prisma/client';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import LearningFlowList from './learning-flow-list';

interface LearningFlowProps {
  initialData: LearningModule & { learningFlow: LearningFlow[] };
  learningModuleId: string;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required',
  }),
});

export const LearningFlowForm = ({
  initialData,
  learningModuleId,
}: LearningFlowProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });
  const router = useRouter();

  const toggleCreating = () => setIsCreating((current) => !current);

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const update = await axios.post(
        `/api/curriculum/modul-ajar/${learningModuleId}/learning-flows`,
        values
      );
      toast.success('Kegiatan Pembelajaran Dibuat');
      toggleCreating();
      router.refresh();
    } catch {
      toast.error('Terdapat Kendala');
    }
  };
  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      await axios.put(
        `/api/curriculum/modul-ajar/${learningModuleId}/learning-flows/reorder`,
        {
          list: updateData,
        }
      );
      toast.success('Kegiatan Pembelejaran Diubah');
    } catch {
      toast.error('Terdapat Kendala');
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(
      `/teacher/curriculum/modul-ajar/${learningModuleId}/chapters/${id}`
    );
  };

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Kegiatan Pembelajaran
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating && <>Cancel</>}
          {!isCreating && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Tambah Kegiatan
            </>
          )}
        </Button>
      </div>
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
                      placeholder="cth: Pertemuan 1: Pengenalan Kalkulus"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={!isValid || isSubmitting}>
              Buat
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            'text-sm mt-2',
            !initialData.learningFlow.length && 'text-slate-500 italic'
          )}
        >
          {!initialData.learningFlow.length &&
            'Tidak terdapat Kegiatan Pembelajaran'}
          <LearningFlowList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.learningFlow || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Seret dan lepas untuk mengurutkan kegiatan pembelajaran
        </p>
      )}
    </div>
  );
};
