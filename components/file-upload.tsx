'use client';

import { ourFileRouter } from '@/app/api/uploadthing/core';
import { UploadDropzone } from '@/lib/uploadthing';
import toast from 'react-hot-toast';
import { withUt } from 'uploadthing/tw';
import { Cloud, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onChange: (url?: string, name?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0]?.url, res?.[0]?.name);
      }}
      content={{
        uploadIcon: () => <Cloud className="h-6 w-6" />,
        label({ ready }) {
          if (ready) return <div>Seret File</div>;

          return <Loader2 className="animate-spin" />;
        },
        button({ ready }) {
          if (ready) return <div>Upload</div>;

          return 'Mempersiapkan ....';
        },
        allowedContent({ ready, uploadProgress, isUploading }) {
          if (!ready) return 'Mempersiapkan ...';
          if (isUploading) return `Mengupload ${uploadProgress} %`;

          return `atau Klik untuk Upload`;
        },
      }}
    />
  );
};
