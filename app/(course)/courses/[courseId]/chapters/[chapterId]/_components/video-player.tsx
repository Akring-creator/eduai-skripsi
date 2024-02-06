'use client';

import axios from 'axios';
import MuxPlayer from '@mux/mux-player-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useConfettiStore } from '@/hooks/use-confetti-store';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
  playbackId: string;
  courseId: string;
  chapterId: string;
  videoUrl: string;
  videoType: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
}

export const VideoPlayer = ({
  playbackId,
  courseId,
  videoType,
  videoUrl,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
  title,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();
  const [showMessage, setShowMessage] = useState(false);
  const [seekedTime, setSeekedTime] = useState(0);
  const [playing, setPlaying] = useState(true);

  const handleSeek = (time: number) => {
    if (time === 30 || time === 90) {
      setSeekedTime(time);
      setShowMessage(true);
      setPlaying(false);
      setTimeout(() => setShowMessage(false), 3000); // Hide message after 3 seconds
    }
  };

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          {
            isCompleted: true,
          }
        );

        if (!nextChapterId) {
          confetti.onOpen();
        }

        toast.success('Progress updated');
        router.refresh();

        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
      }
    } catch {
      toast.error('Terdapat Kendala');
    }
  };

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked &&
        (videoType === 'mux' ? (
          <MuxPlayer
            title={title}
            className={cn(!isReady && 'hidden')}
            onCanPlay={() => setIsReady(true)}
            onEnded={onEnd}
            autoPlay
            playbackId={playbackId}
          />
        ) : (
          videoType === 'youtube' && (
            <div className={cn(!isReady && 'hidden', 'h-full')}>
              {showMessage && (
                <div className="text-3xl">
                  {seekedTime === 30 ? 'Kamu di detik 30' : 'Kamu di detik 90'}
                </div>
              )}
              <ReactPlayer
                url={videoUrl}
                playing={playing}
                controls={true}
                onEnded={onEnd}
                onReady={() => setIsReady(true)}
                height="100%"
                onSeek={(time) => handleSeek(time)}
                width="100%"
              />
            </div>
          )
        ))}
    </div>
  );
};
