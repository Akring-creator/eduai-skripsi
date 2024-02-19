import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { PineconeStore } from '@langchain/pinecone';
import { pinecone } from '@/lib/pinecone';
import { getProfile } from '@/actions/get-profile';

export async function GET(req: Request) {
  try {
    const profile = await getProfile();
    const { title } = await req.json();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const file = await db.file.findMany({
      where: {
        profileId: profile.id,
      },
    });
    return NextResponse.json(file);
  } catch (error) {
    console.log('[learningModules]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const profile = await getProfile();
    const { url, name } = await req.json();

    if (!profile) {
      return new NextResponse('Unathourized', { status: 401 });
    }

    const file = await db.file.create({
      data: {
        profileId: profile.id,
        url,
        name: name,
        uploadStatus: 'PROCESSING',
      },
    });
    const response = await fetch(file.url);
    const blob = await response.blob();

    try {
      const loader = new PDFLoader(blob);

      const pageLevelDocs = await loader.load();

      const pagesAmt = pageLevelDocs.length;

      // vectorize and index entire document
      const pineconeIndex = pinecone.Index('edtek');

      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
      });

      await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
        pineconeIndex,
        namespace: file.id,
      });

      await db.file.update({
        data: {
          uploadStatus: 'SUCCESS',
        },
        where: {
          id: file.id,
        },
      });
    } catch (err) {
      await db.file.update({
        data: {
          uploadStatus: 'FAILED',
        },
        where: {
          id: file.id,
        },
      });
    }

    return NextResponse.json(file);
  } catch (error) {
    console.log('COURSE_ID_ATTACHMENTS', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
export async function DELETE(req: Request) {
  try {
    const profile = await getProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { fileId } = await req.json();

    // Pastikan file yang hendak dihapus milik pengguna yang sedang masuk
    const fileToDelete = await db.file.findFirst({
      where: {
        id: fileId,
        profileId: profile.id,
      },
    });

    if (!fileToDelete) {
      return new NextResponse('File not found or unauthorized', {
        status: 404,
      });
    }

    // Lakukan penghapusan file dari database
    await db.file.delete({
      where: {
        profileId: profile.id,
        id: fileId,
      },
    });

    return new NextResponse('File deleted successfully', { status: 200 });
  } catch (error) {
    console.error('[learningModules]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
