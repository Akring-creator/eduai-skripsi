import { SocketIndicator } from '@/components/socket-indicator';
import { ChatInput } from './_components/chat-input';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

const ChatPage = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect('/');
  }
  const file = await db.file.findUnique({
    where: {
      userId: userId,
      id: 'f97a7f22-26cd-4e15-8db3-c230e24b7935',
    },
  });
  if (!file) {
    redirect('/');
  }
  return (
    <div className="p-6 bg-grey flex flex-col h-full">
      <div className=" flex justify-between items-center ">
        <div>Profil Pengguna</div>
        <SocketIndicator />
      </div>
      <div className="flex-1">Messagaes</div>
      <ChatInput
        name={file.name}
        apiUrl="/api/socket/messages"
        type="conversation"
        query={{
          fileId: file.id,
        }}
      />
    </div>
  );
};

export default ChatPage;
