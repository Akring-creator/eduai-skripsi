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
import { LearningModule } from '@prisma/client';
import { Combobox } from '@/components/ui/combobox';

interface ModuleIdentityFormProps {
  initialData: LearningModule;
  learningModuleId: string;
  phaseOptions: { label: string; value: string }[];
  educationLevelOptions: { label: string; value: string }[];
  subjectOptions: { label: string; value: string }[];
}

const formSchema = z.object({
  title: z.string().min(1),
  writer: z.string().min(1),
  learningYear: z.string().min(1),
  institute: z.string().min(1),
  phaseId: z.string().min(1),
  educationLevelId: z.string().min(1),
  subjectId: z.string().min(1),
  class: z.coerce.number(),
});

export const ModuleIdentityForm = ({
  initialData,
  learningModuleId,
  phaseOptions,
  educationLevelOptions,
  subjectOptions,
}: ModuleIdentityFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title,
      writer: initialData?.writer || '',
      learningYear: initialData?.learningYear || '',
      institute: initialData?.institute || '',
      phaseId: initialData?.phaseId || '',
      educationLevelId: initialData?.educationLevelId || '',
      subjectId: initialData?.subjectId || '',
      class: initialData?.class || 0,
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
      toast.success('Mengubah Identitas');
      toggleEdit();
      router.refresh();
    } catch {
      toast.error('Tedapat Kendala');
    }
    console.log(values);
  };
  const selectedPhaseOption = phaseOptions.find(
    (option) => option.value === initialData.phaseId
  );
  const selectedEducationLevelOption = educationLevelOptions.find(
    (option) => option.value === initialData.educationLevelId
  );
  const subjectOption = subjectOptions.find(
    (option) => option.value === initialData.subjectId
  );

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Identitas
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Identitas
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div>
          <p className="text-sm mt-2">
            <span className="font-bold inline-block w-[150px]">Judul</span>
            :&nbsp;
            {initialData.title}
          </p>
          <p
            className={cn(
              'text-sm mt-2',
              !initialData.writer && 'text-slate-500 italic'
            )}
          >
            <span className="font-bold inline-block w-[150px]">Penulis</span>
            :&nbsp;
            {initialData.writer || ''}
          </p>
          <p
            className={cn(
              'text-sm mt-2',
              !initialData.institute && 'text-slate-500 italic'
            )}
          >
            <span className="font-bold inline-block w-[150px]">Institusi</span>
            :&nbsp;
            {initialData.institute || ''}
          </p>
          <p
            className={cn(
              'text-sm mt-2',
              !initialData.learningYear && 'text-slate-500 italic'
            )}
          >
            <span className="font-bold inline-block w-[150px]">
              Tahun Ajaran
            </span>
            :&nbsp;
            {initialData.learningYear || ''}
          </p>
          <p
            className={cn(
              'text-sm mt-2',
              !initialData.phaseId && 'text-slate-500 italic'
            )}
          >
            <span className="font-bold inline-block w-[150px]">Fase</span>
            :&nbsp;
            {selectedPhaseOption?.label || ''}
          </p>
          <p
            className={cn(
              'text-sm mt-2',
              !initialData.phaseId && 'text-slate-500 italic'
            )}
          >
            <span className="font-bold inline-block w-[150px]">
              Tingkat Pendidikan
            </span>
            :&nbsp;
            {selectedEducationLevelOption?.label || ''}
          </p>
          <p
            className={cn(
              'text-sm mt-2',
              !initialData.class && 'text-slate-500 italic'
            )}
          >
            <span className="font-bold inline-block w-[150px]">Kelas</span>
            :&nbsp;
            {initialData.class || ''}
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
            {subjectOption?.label || ''}
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul Modul Ajar: </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="cth: Modul Ajar Geografi Kelas XII"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="writer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Penulis: </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="cth: Adrian, S.Pd"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="institute"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institusi: </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="cth: SMA Negeri 10 Samarinda"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="learningYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tahun Ajaran: </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="cth: 2023/2024"
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
                  name="phaseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fase: </FormLabel>
                      <FormControl>
                        <Combobox
                          placeholder="Pilih fase ..."
                          emptymsg="Fase tidak ditemukan"
                          options={[...phaseOptions]}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="educationLevelId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tingkat Pendidikan: </FormLabel>
                      <FormControl>
                        <Combobox
                          placeholder="Pilih tingkat pendidikan ..."
                          emptymsg="Tingkat pendidikan tidak ditemukan"
                          options={[...educationLevelOptions]}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="class"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kelas</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="1"
                          placeholder="Kelas"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subjectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mata Pelajaran: </FormLabel>
                      <FormControl>
                        <Combobox
                          placeholder="Pilih mata pelajaran"
                          emptymsg="Mata pelajaran tidak ditemukan"
                          options={[...subjectOptions]}
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
