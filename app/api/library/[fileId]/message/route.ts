import { db } from '@/lib/db';
import { pinecone } from '@/lib/pinecone';
import { auth } from '@clerk/nextjs';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
export async function DELETE(
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

    const pineconeIndex = pinecone.Index('quill');

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
            'Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.',
        },
        {
          role: 'user',
          content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
        
  \n----------------\n
  
  PREVIOUS CONVERSATION:
  ${formattedPrevMessages.map((message) => {
    if (message.role === 'user') return `User: ${message.content}\n`;
    return `Assistant: ${message.content}\n`;
  })}
  
  \n----------------\n
  
  CONTEXT:
  ${results.map((r) => r.pageContent).join('\n\n')}
  
  USER INPUT: ${message}`,
        },
      ],
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('[PDF_FILE_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
