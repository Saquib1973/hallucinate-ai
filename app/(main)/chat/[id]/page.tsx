import { getChatById } from '@/modules/chat/actions';
import { ChatSession } from '@/modules/chat/components/chat-session';

interface ChatPageProps {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ChatPage = async ({ params, searchParams }: ChatPageProps) => {
    const resolvedParams = await params;
    const resolvedSearchParams = searchParams ? await searchParams : {};
    const autoTrigger = resolvedSearchParams.autoTrigger === 'true';

    const chatRes = await getChatById(resolvedParams.id);

    if (!chatRes.success || !chatRes.data) {
        return <div className="flex h-full items-center justify-center text-gray-500">Chat not found</div>;
    }

    const dbMessages = chatRes.data.messages || [];
    const initialMessages = dbMessages.map((msg: any) => {
        let textContent = msg.content;
        try {
            const parts = JSON.parse(msg.content);
            if (Array.isArray(parts)) {
                textContent = parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('\n');
            }
        } catch (e) { }

        return {
            id: msg.id,
            role: msg.messageRole.toLowerCase(),
            content: textContent,
        }
    });

    return <ChatSession chatId={resolvedParams.id} initialMessages={initialMessages} autoTrigger={autoTrigger} initialModel={chatRes.data.model} isSharedInitial={chatRes.data.isShared} />;
};

export default ChatPage;