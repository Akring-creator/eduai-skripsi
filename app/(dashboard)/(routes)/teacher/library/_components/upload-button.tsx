'use client';

import { Button } from '@/components/ui/button';
import Dropzone from 'react-dropzone';
import { DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Dialog } from '@radix-ui/react-dialog';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Cloud, File, Loader2 } from 'lucide-react';
import { FileUpload } from '@/components/file-upload';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Progress } from '@/components/ui/progress';

import * as z from 'zod';

// Import necessary dependencies and components

const formSchema = z.object({
  url: z.string().min(1, {
    message: 'Image is Required',
  }),
  name: z.string().min(1, {
    message: 'Image is Required',
  }),
});
const UploadButton = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const update = await axios.post(`/api/library`, values);
      toast.success('Berhasil Menambahkan Lampiran');

      router.refresh();
    } catch {
      toast.error('Terdapat Kendala');
    }
    console.log(values);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        if (!value) {
          setIsOpen(value);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button>Upload PDF</Button>
      </DialogTrigger>
      <DialogContent>
        <FileUpload
          endpoint="courseAttachment"
          onChange={(url, name) => {
            if (url && name) {
              onSubmit({ url: url, name: name });
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
