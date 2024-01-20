'use client';

import { Button } from '@/components/ui/button';
import { DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Dialog } from '@radix-ui/react-dialog';
import { useState } from 'react';

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState(false);
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
      <DialogContent>Something</DialogContent>
    </Dialog>
  );
};

export default UploadButton;
