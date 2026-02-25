"use client";

import ChatLoading from '@/modules/chat/components/chat-loading';
import { ChatSession } from '@/modules/chat/components/chat-session';
import { useChatId } from '@/modules/chat/hooks/chat';
import { use } from 'react';
import { parseMessageContent } from '@/modules/chat/lib/utils';

interface ChatPageProps {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ChatPage = ({ params, searchParams }: ChatPageProps) => {
    const resolvedParams = use(params);
    const resolvedSearchParams = searchParams ? use(searchParams) : {};
    const autoTrigger = resolvedSearchParams.autoTrigger === 'true';

    const { data: chatRes, isLoading } = useChatId(resolvedParams.id);

    if (isLoading) return <ChatLoading />

    if (!chatRes?.success || !chatRes?.data) {
        return <div className="flex h-full items-center justify-center text-gray-500">Chat not found</div>;
    }

    const dbMessages = chatRes.data.messages || [];
    const initialMessages = dbMessages.map((msg: any) => ({
        id: msg.id,
        role: msg.messageRole.toLowerCase(),
        content: parseMessageContent(msg.content),
    }));

    return <ChatSession chatId={resolvedParams.id} initialMessages={initialMessages} autoTrigger={autoTrigger} initialModel={chatRes.data.model} isSharedInitial={chatRes.data.isShared} />;
};

export default ChatPage;