import { getSharedChatById } from "@/modules/chat/actions";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import React from "react";
import Image from "next/image";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const chatRes = await getSharedChatById(resolvedParams.id);
    if (!chatRes.success || !chatRes.data) return { title: "Shared Chat - Not Found" };
    return { title: `${chatRes.data.title} - Shared Chat` };
}

export default async function SharedChatPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const chatRes = await getSharedChatById(resolvedParams.id);

    if (!chatRes.success || !chatRes.data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Chat Not Found</h1>
                <p className="text-gray-500">This chat might not exist or the owner has disabled sharing.</p>
            </div>
        );
    }

    const chat = chatRes.data;

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <div className="h-16 border-b border-gray-100/60 flex items-center justify-between px-6 sticky top-0 bg-white/80 backdrop-blur-sm z-30">
                <div className="flex flex-col">
                    <h2 className="text-sm font-semibold text-gray-800">{chat.title}</h2>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        Shared by
                        {chat.user.image ? (
                            <Image src={chat.user.image} alt={chat.user.name} width={14} height={14} className="rounded-full" />
                        ) : null}
                        {chat.user.name}
                    </p>
                </div>
                <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                    Read Only
                </div>
            </div>

            <div className="flex-1 overflow-y-auto w-full">
                <div className="max-w-4xl px-4 py-8 mx-auto flex flex-col gap-6">
                    {chat.messages.map((msg: any) => {
                        let contentToRender = msg.content;
                        try {
                            const parsed = JSON.parse(msg.content);
                            if (Array.isArray(parsed)) {
                                contentToRender = parsed.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('\n');
                            }
                        } catch (e) {
                            // If it's not JSON, it's just raw text
                        }

                        // Pre-process LLM's LaTeX delimiters (\[ \], \( \)) into standard Markdown standard ($$, $) for remark-math
                        contentToRender = contentToRender
                            .replace(/\\\[/g, '$$$$')
                            .replace(/\\\]/g, '$$$$')
                            .replace(/\\\(/g, '$')
                            .replace(/\\\)/g, '$');

                        const isUser = msg.messageRole === 'USER';

                        return (
                            <React.Fragment key={msg.id}>
                                <Message from={isUser ? 'user' : 'assistant'}>
                                    <MessageContent>
                                        {isUser ? (
                                            <div className="whitespace-pre-wrap">{contentToRender}</div>
                                        ) : (
                                            <MessageResponse>{contentToRender}</MessageResponse>
                                        )}
                                    </MessageContent>
                                </Message>
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
