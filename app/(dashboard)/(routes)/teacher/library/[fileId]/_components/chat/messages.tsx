import { Loader2, MessageSquare, ServerCrash } from 'lucide-react';
import { MAX_MESSAGES_LIMIT } from '@/config/constant';
import Skeleton from 'react-loading-skeleton';
import { Fragment, useContext, useEffect, useRef } from 'react';
import { ChatContext } from './chat-context';
import { useIntersection } from '@mantine/hooks';
import axios from 'axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import * as qs from 'qs';
import { useChatQuery } from '@/hooks/use-chat-queries';
import Message from './message';

interface MessagesProps {
  fileId: string;
}

const Messages = ({ fileId }: MessagesProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey: 'fileMessages',
      apiUrl: '/api/library/messages',
      paramKey: 'fileId',
      paramValue: fileId,
    });

  const messages = data?.pages.flatMap((page) => page.messages);

  if (status === 'pending') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div className="flex max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
      <div>
        {messages?.map((msg, i) => {
          const isNextMessageSamePerson =
            messages[i - 1]?.isUserMessage === messages[i]?.isUserMessage;
          return (
            <Fragment key={i}>
              <Message
                message={msg}
                isNextMessageSamePerson={isNextMessageSamePerson}
              />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Messages;
