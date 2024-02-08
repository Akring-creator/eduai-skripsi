import { NextApiRequest } from 'next';

import { NextApiResponseServerIo } from '@/types';

import { db } from '@/lib/db';
import { openai } from '@/lib/openai';
import { pinecone } from '@/lib/pinecone';
import { getAuth } from '@clerk/nextjs/server';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { OpenAIStream, StreamingTextResponse } from 'ai';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { fileId } = req.query;
    if (!fileId) {
      return res.status(400).json({ error: 'File ID missing' });
    }

    const { content } = req.body;
    const msg = content;
    console.log(msg);

    if (!msg) {
      return res.status(400).json({ error: 'Message missing' });
    }

    const file = await db.file.findUnique({
      where: {
        id: fileId as string,
        userId: userId,
      },
    });

    if (!file) {
      return res.status(404).json({ error: 'File Not Found' });
    }
    const message = await db.message.create({
      data: {
        text: msg,
        isUserMessage: true,
        userId,
        fileId: fileId as string,
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
        fileId: fileId as string,
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
            fileId: fileId as string,
            userId,
          },
        });
      },
    });

    const updateKey = `chat:${fileId as string}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey);

    return undefined;
  } catch (error) {
    console.log('[MESSAGE_ID]', error);
    return res.status(500).json({ error: 'Internal Error' });
  }
}
