import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { chapterGenerator } from '@/lib/openai';
import { getTranscript, searchYoutube } from '@/lib/youtube';
import { getProfile } from '@/actions/get-profile';
export const POST = async (req: Request) => {
  try {
    const profile = await getProfile();

    if (!profile) {
      return new NextResponse('Unathourized', { status: 401 });
    }

    const chapter = await req.json();

    const videoId = await searchYoutube(chapter.title);
    const description = await getTranscript(videoId);
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    const newChapter = {
      ...chapter,
      isFinished: true,
      description: description,
      videoUrl: url,
      videoType: 'youtube',
    };

    return NextResponse.json(newChapter);
  } catch (error) {
    console.log('[VIDEO_GENERATION]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
