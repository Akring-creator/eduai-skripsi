'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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

interface FlashGameProps {
  quizId: string;
}
const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is Required',
  }),
  time: z.coerce.number(),
  gameType: z.string().min(1, {}),
});
export const FlashGame = ({ quizId }: FlashGameProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      time: 5,
      gameType: 'FLASH',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const games = await axios.post(`/api/games/${quizId}`, values);
      const gamePublicId = games.data.publicId;
      router.push(`/games/${gamePublicId}`);
    } catch {
      toast.error('Terdapat kendala');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 mt-2">
        <Card>
          <CardHeader>
            <CardTitle>Atur Game</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="cth: Tes Kilat"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Waktu</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="5"
                      min={5}
                      placeholder="Menit bermain"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Waktu dalam menit</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <div className="flex items-center gap-x-2">
              <Link href={`/quiz/${quizId}`}>
                <Button type="button" variant="ghost">
                  Batal
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Main
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
