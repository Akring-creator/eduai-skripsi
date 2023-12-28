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
import { Course, LearningModule } from '@prisma/client';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Combobox } from '@/components/ui/combobox';

interface PhaseFormProps {
  initialData: LearningModule;
  learningModuleId: string;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  phaseId: z.string().min(1),
});

export const PhaseForm = ({
  initialData,
  learningModuleId,
  options,
}: PhaseFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phaseId: initialData?.phaseId || '',
    },
  });
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const update = await axios.patch(
        `/api/curriculum/modul-ajar/${learningModuleId}`,
        values
      );
      toast.success('Fase diubah');
      toggleEdit();
      router.refresh();
    } catch {
      toast.error('Terdapat Kendala');
    }
    console.log(values);
  };
  const selectedOption = options.find(
    (option) => option.value === initialData.phaseId
  );

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Fase Modul Ajar
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Ganti Fase
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            'text-sm mt-2',
            !initialData.phaseId && 'text-slate-500 italic'
          )}
        >
          {selectedOption?.label || 'Fase masih kosong'}
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
              name="phaseId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      placeholder="Pilih fase ..."
                      emptymsg="Tidak ditemukan fase"
                      options={[...options]}
                      {...field}
                    />
                  </FormControl>
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
