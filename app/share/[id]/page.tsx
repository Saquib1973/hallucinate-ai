import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { getSharedChatById } from "@/modules/chat/actions";
import { parseMessageContent, preprocessLaTeX } from "@/modules/chat/lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const chatRes = await getSharedChatById(resolvedParams.id);
    if (!chatRes.success || !chatRes.data) return { title: "Chat Not Found" };
    return { title: `${chatRes.data.title} - Shared Chat` };
}

export default async function SharedChatPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const chatRes = await getSharedChatById(resolvedParams.id);

    if (!chatRes.success || !chatRes.data) {
        return notFound()
    }

    const chat = chatRes.data;

    return (
        <div className="flex flex-col min-h-screen  font-sans ">
            <header className="h-14 border-b border-gray-50 flex items-center justify-between px-4 sm:px-6 sticky top-0 bg-white">
                <div className="flex items-center truncate pr-4">
                    <h1 className="text-sm font-medium text-gray-800 truncate">
                        {chat.title}
                    </h1>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 pr-3 border-r border-gray-100">
                        <span>Shared by</span>
                        {chat.user.image ? (
                            <Image
                                src={chat.user.image}
                                alt={chat.user.name}
                                width={18}
                                height={18}
                                className="rounded-full"
                            />
                        ) : null}
                        <span className="font-medium">{chat.user.name}</span>
                    </div>
                    <span className="text-[13px] font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md">
                        Read Only
                    </span>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto w-full pb-24">
                <div className="max-w-3xl px-4 py-10 mx-auto flex flex-col gap-8">
                    {chat.messages.map((msg: any) => {
                        let contentToRender = parseMessageContent(msg.content);
                        contentToRender = preprocessLaTeX(contentToRender);
                        const isUser = msg.messageRole === 'USER';

                        return (
                            <div
                                key={msg.id}
                                className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                            >
                                {isUser ? (
                                    <div className="bg-gray-100 px-5 py-3 rounded-2xl rounded-tr-sm max-w-[85%] sm:max-w-[75%] text-sm whitespace-pre-wrap leading-relaxed">
                                        {contentToRender}
                                    </div>
                                ) : (
                                    <div className="w-full text-sm text-gray-800 leading-relaxed">
                                        <Message from="assistant">
                                            <MessageContent>
                                                <MessageResponse>
                                                    {contentToRender}
                                                </MessageResponse>
                                            </MessageContent>
                                        </Message>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}