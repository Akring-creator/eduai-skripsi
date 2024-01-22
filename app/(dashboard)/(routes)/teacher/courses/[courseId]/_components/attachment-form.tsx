'use client';
import { FileUpload } from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import { Attachment, Course } from '@prisma/client';
import axios from 'axios';
import { File, Loader2, PlusCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import * as z from 'zod';

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1, {
    message: 'Image URL is required',
  }),
  name: z.string().min(1, {
    message: 'Image URL is required',
  }),
});

export const AttachmentForm: React.FC<AttachmentFormProps> = ({
  initialData,
  courseId,
}) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const update = await axios.post(
        `/api/courses/${courseId}/attachments`,
        values
      );
      toast.success('Attachment successfully added');
      toggleEdit();
      router.refresh();
    } catch (error) {
      console.error('Error adding attachment:', error);
      toast.error('An error occurred while adding attachment');
    }
    console.log(values);
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success('Attachment deleted');
      router.refresh();
    } catch (error) {
      console.error('Error deleting attachment:', error);
      toast.error('An error occurred while deleting attachment');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Attachments
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 mr-2" /> Add Attachment
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachments available
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">{attachment.name}</p>
                  {isDeletingId === attachment.id ? (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    <button
                      onClick={() => onDelete(attachment.id)}
                      className="ml-auto hover:opacity-75 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url, name) => {
              if (url && name) {
                onSubmit({ url, name });
              }
            }}
          />
          <div className="text-ts text-muted-foreground mt-4">
            Add attachments to your course
          </div>
        </div>
      )}
    </div>
  );
};
