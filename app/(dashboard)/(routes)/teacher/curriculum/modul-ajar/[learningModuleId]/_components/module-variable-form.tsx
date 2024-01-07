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
import { Pencil, Route } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LearningModule, learningModa } from '@prisma/client';
import { Combobox } from '@/components/ui/combobox';

interface ModuleVariableFormProps {
  initialData: LearningModule;
  learningModuleId: string;
  modaOptions: { label: string; value: string }[];
}

const formSchema = z.object({
  material: z.string().min(1),
  modaId: z.string().min(1),
  model: z.string().min(1),
  numOfMeeting: z.coerce.number(),
  learningHours: z.coerce.number(),
  studentTargetId: z.string().min(1),
  method: z.string().min(1),
});

export const ModuleVariableForm = ({
  initialData,
  learningModuleId,
  modaOptions,
}: ModuleVariableFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      material: initialData.material || '',
      modaId: initialData?.modaId || '',
      model: initialData?.model || '',
      numOfMeeting: initialData?.numOfMeeting || 0,
      learningHours: initialData?.learningHours || 0,
      studentTargetId: initialData?.studentTargetId || '',
      method: initialData?.method || '',
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
      toast.success('Merubah Komponen');
      toggleEdit();
      router.refresh();
    } catch {
      toast.error('Tedapat Kendala');
    }
    console.log(values);
  };
  const modaOption = modaOptions.find(
    (option) => option.value === initialData.modaId
  );

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Komponen
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Batal</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Komponen
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div>
          <p className="text-sm mt-2">
            <span className="font-bold inline-block w-[150px]">Model</span>
            :&nbsp;
            {initialData.model}
          </p>

          <p
            className={cn(
              'text-sm mt-2',
              !initialData.subjectId && 'text-slate-500 italic'
            )}
          >
            <span className="font-bold inline-block w-[150px]">
              Mata Pelajaran
            </span>
            :&nbsp;
            {modaOption?.label || ''}
          </p>
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul Modul Ajar: </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="cth: Pembelajaran Berbasis Project"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 mt-8"
              >
                <FormField
                  control={form.control}
                  name="modaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moda: </FormLabel>
                      <FormControl>
                        <Combobox
                          placeholder="Pilih moda ..."
                          emptymsg="Moda tidak ditemukan"
                          options={[...modaOptions]}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
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
