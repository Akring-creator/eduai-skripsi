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
import { ManualForm } from './_components/manual';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Label } from '@/components/ui/label';
import { Bot, Pencil } from 'lucide-react';
import { AutomaticForm } from './_components/automatic';
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
          <ManualForm />
        </TabsContent>
        <TabsContent value="ai">
          <AutomaticForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatePage;
