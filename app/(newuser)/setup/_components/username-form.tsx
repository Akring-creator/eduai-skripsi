'use client';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

const formSchema = z.object({
  username: z.string().min(1, {
    message: 'This is Required',
  }),
});

const SetupPage = () => {
  const [message, setMessage] = useState('');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: '' },
  });
  const { isSubmitting, isValid } = form.formState;
  const router = useRouter();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post('/api/profile/username', values);
      console.log(response.data);
      const isExist = response.data;
      if (!isExist) {
        try {
          const profile = await axios.post('/api/profile', values);

          router.push('/');
        } catch (error) {
          console.log('[USERNAME_CREATION]', error);
        }
      } else {
        setMessage('username sudah digunakan');
      }
    } catch (error) {}
  };
  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tambahkan Username</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="username"
                    {...field}
                  />
                </FormControl>
                <FormDescription>{message}</FormDescription>
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
    </div>
  );
};

export default SetupPage;
