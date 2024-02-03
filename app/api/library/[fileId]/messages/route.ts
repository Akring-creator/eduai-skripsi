import { db } from '@/lib/db';
import { pinecone } from '@/lib/pinecone';
import { auth } from '@clerk/nextjs';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { MAX_MESSAGES_LIMIT } from '@/config/constant';

export async function GET(
  req: Request,
  { params }: { params: { fileId: string } }
) {
  try {
    const { userId } = auth();
    const { input } = await req.json();
    const cursor = input.cursor;
    const limit = input.limit ?? MAX_MESSAGES_LIMIT;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const file = await db.file.findUnique({
      where: {
        id: params.fileId,
        userId,
      },
    });

    if (!file) {
      return new NextResponse('File not found', { status: 404 });
    }
    const messages = await db.message.findMany({
      take: limit + 1,
      where: {
        fileId: params.fileId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      cursor: cursor ? { id: cursor } : undefined,
      select: {
        id: true,
        isUserMessage: true,
        createdAt: true,
        text: true,
      },
    });

    let nextCursor: typeof cursor | undefined = undefined;
    if (messages.length > limit) {
      const nextItem = messages.pop();
      nextCursor = nextItem?.id;
    }

    const data = { messages: messages, nextCursor: nextCursor };
    return NextResponse.json(data);
  } catch (error) {}
}
export async function POST(
  req: Request,
  { params }: { params: { fileId: string } }
) {
  try {
    const { userId } = auth();
    const { msg } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const file = await db.file.findUnique({
      where: {
        id: params.fileId,
        userId,
      },
    });

    if (!file) {
      return new NextResponse('File not found', { status: 404 });
    }
    const message = await db.message.create({
      data: {
        text: msg,
        isUserMessage: true,
        userId,
        fileId: params.fileId,
      },
    });

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const pineconeIndex = pinecone.Index('edtek');

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      namespace: file.id,
    });

    const results = await vectorStore.similaritySearch(msg, 4);

    const prevMessages = await db.message.findMany({
      where: {
        fileId: params.fileId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: 6,
    });

    const formattedPrevMessages = prevMessages.map((msg) => ({
      role: msg.isUserMessage ? ('user' as const) : ('assistant' as const),
      content: msg.text,
    }));

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0,
      stream: true,
      messages: [
        {
          role: 'system',
          content:
            'Gunakan potongan konteks berikut (atau percakapan sebelumnya jika diperlukan) untuk menjawab pertanyaan pengguna dalam format markdown.',
        },
        {
          role: 'user',
          content: `Gunakan potongan konteks berikut (atau percakapan sebelumnya jika diperlukan) untuk menjawab pertanyaan pengguna dalam format markdown. \nJika Anda tidak tahu jawabannya, katakan saja bahwa Anda tidak tahu, jangan mencoba membuat jawaban palsu.
      
      \n----------------\n
      
      PERCAKAPAN SEBELUMNYA:
      ${formattedPrevMessages.map((message) => {
        if (message.role === 'user') return `Pengguna: ${message.content}\n`;
        return `Asisten: ${message.content}\n`;
      })}
      
      \n----------------\n
      
      KONTEKS:
      ${results.map((r) => r.pageContent).join('\n\n')}
      
      MASUKAN PENGGUNA: ${message}`,
        },
      ],
    });

    const stream = OpenAIStream(response, {
      async onCompletion(completion) {
        await db.message.create({
          data: {
            text: completion,
            isUserMessage: false,
            fileId: params.fileId,
            userId,
          },
        });
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('[CHAT_AI_PDF]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
