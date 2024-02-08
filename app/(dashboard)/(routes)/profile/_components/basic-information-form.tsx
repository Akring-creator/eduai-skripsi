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
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
interface BasicInformationProps {
  profile: {
    name: string;
    email: string;
  };
}
const formSchema = z.object({
  name: z.string().min(1, {
    message: 'This is Required',
  }),
  email: z.string().min(1, {
    message: 'This is Required',
  }),
});
const BasicInformation = ({ profile }: BasicInformationProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile.name,
      email: profile.email,
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const { isSubmitting, isValid } = form.formState;
  const router = useRouter();
  const toggleEdit = () => setIsEditing((current) => !current);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const update = await axios.patch(`/api/profile/basic`, values);
      toast.success('Berhasil diubah');
      toggleEdit();
      router.refresh();
    } catch {
      toast.error('Ada Masalah');
    }
    console.log(values);
  };
  return (
    <div>
      <div className="font-medium flex items-center justify-between">
        Info Akun
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Batal</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-y-2 mt-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <p>{profile.name}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <p>{profile.email}</p>
          </div>
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          disabled={isSubmitting}
                          placeholder={profile.name}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          disabled={isSubmitting}
                          placeholder={profile.email}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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

export default BasicInformation;
