'use client';

import { FileUpload } from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MuxPlayer from '@mux/mux-player-react';
import { Chapter, MuxData } from '@prisma/client';
import axios from 'axios';
import {
  Bot,
  Pencil,
  PlusCircle,
  Video,
  Youtube as YoutubeIcon,
} from 'lucide-react';
import YouTube from 'react-youtube';
import ReactPlayer from 'react-player/youtube';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import * as z from 'zod';

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData: MuxData | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [linkYoutube, setLinkYoutube] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  function isWordInUrl(word: string, url: string): boolean {
    const lowerCaseWord = word.toLowerCase();
    const lowerCaseUrl = url.toLowerCase();

    // Menggunakan method includes
    if (
      lowerCaseUrl.includes(lowerCaseWord) ||
      lowerCaseUrl.includes('youtu.be')
    ) {
      return true;
    }

    // Menggunakan method indexOf
    return (
      lowerCaseUrl.indexOf(lowerCaseWord) !== -1 ||
      lowerCaseUrl.indexOf('youtu.be') !== -1
    );
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const update = await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success('Chapter Updated');
      toggleEdit();
      router.refresh();
    } catch {
      toast.error('Ada Masalah');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Video Chapter
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 mr-2" />
              Tambahkan Video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Ganti Video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            {isWordInUrl('youtube', initialData.videoUrl) ? (
              // Render YouTube player here
              // You can use a third-party library like 'react-youtube' for this
              // Example: https://www.npmjs.com/package/react-youtube
              <div className="w-90">
                {/* <YouTube videoId="qTxhxhcsceU" /> */}
                <ReactPlayer url={initialData.videoUrl} width="100%" />
              </div>
            ) : (
              <MuxPlayer playbackId={initialData?.muxData?.playbackId || ''} />
            )}
          </div>
        ))}
      {isEditing && (
        <div>
          <Tabs defaultValue="upload">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">
                <div className="flex items-center">
                  <p className="mr-2">Upload</p>
                  <Video className="h-3 w-3" />
                </div>
              </TabsTrigger>
              <TabsTrigger value="youtube">
                <div className="flex items-center">
                  <p className="mr-2">Youtube</p>
                  <YoutubeIcon className="h-3 w-3" />
                </div>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <Card>
                <CardHeader>
                  <CardDescription>Upload Video</CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    endpoint="chapterVideo"
                    onChange={(url) => {
                      if (url) {
                        onSubmit({ videoUrl: url });
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="youtube">
              <Card>
                <CardHeader>
                  <CardDescription>Link Youtube</CardDescription>
                </CardHeader>
                <CardContent>
                  <Input
                    type="text"
                    placeholder="Masukkan URL YouTube"
                    onChange={(e) => setLinkYoutube(e.target.value)}
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    onClick={() => onSubmit({ videoUrl: linkYoutube })}
                    disabled={isSubmitting}
                  >
                    Simpan
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
      {initialData.videoUrl && (
        <div className="text-xs text-muted-foreground mt-2">
          Refresh halaman jika video tidak muncul
        </div>
      )}
    </div>
  );
};
