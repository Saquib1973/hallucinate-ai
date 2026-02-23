"use client";

import { useChat } from '@ai-sdk/react';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react';
import { PromptInput } from './prompt-input';
import { useChatStore } from '../store/chat-store';
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';
import { ShareDialog } from './share-dialog';
import { Button } from '@/components/ui/button';
import { Share } from 'lucide-react';
import { useState } from 'react';

interface ChatSessionProps {
    chatId: string;
    initialMessages: any[];
    autoTrigger: boolean;
    initialModel: string;
    isSharedInitial?: boolean;
}

export const ChatSession = ({ chatId, initialMessages, autoTrigger, initialModel, isSharedInitial = false }: ChatSessionProps) => {
    const [isShareOpen, setIsShareOpen] = useState(false);
    const hasTriggered = useChatStore(state => state.hasChatBeenTriggered);
    const markTriggered = useChatStore(state => state.markChatAsTriggered);

    // Only auto-trigger if there is exactly 1 message (the user's initial prompt)
    const isFirstTriggerRef = useRef(autoTrigger && initialMessages.length === 1 && !hasTriggered(chatId));

    const { messages, status, regenerate, sendMessage } = useChat({
        id: chatId,
        messages: initialMessages as any,
    });

    const isLoading = status === 'submitted' || status === 'streaming';

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        if (isFirstTriggerRef.current) {
            const lastMessage = initialMessages[initialMessages.length - 1];
            if (lastMessage?.role === 'user') {
                markTriggered(chatId);

                // Remove autoTrigger from URL so that manual refresh doesn't trigger it again
                const url = new URL(window.location.href);
                url.searchParams.delete('autoTrigger');
                window.history.replaceState({}, '', url.toString());

                // Trigger the reload to stream the AI response for the existing user message
                regenerate({
                    body: {
                        model: initialModel,
                        chatId,
                        skipUserMessage: true
                    }
                });
            }
            isFirstTriggerRef.current = false;
        }
    }, [initialMessages, chatId, markTriggered, regenerate, initialModel]);

    const onSubmit = async (e: React.FormEvent, selectedModelId: string, messageContent: string) => {
        e.preventDefault();
        if (!messageContent.trim()) return;

        await sendMessage({
            text: messageContent,
        }, {
            body: {
                model: selectedModelId,
                chatId,
            }
        });
    }

    return (
        <div className="flex flex-col h-full relative">
            <div className="flex-1 h-full overflow-y-auto pb-48 scrollbar-hide">
                <div className="h-14 max-md:hidden inset-0 flex items-center justify-between px-6 sticky top-0 z-30">
                    <h2 className="text-sm font-semibold text-gray-800">Chat Session #{chatId.slice(-6)}</h2>
                    <Button variant="ghost" size="sm" className="rounded-full gap-2" onClick={() => setIsShareOpen(true)}>
                        <Share className="w-4 h-4" />
                        Share
                    </Button>
                </div>
                <div className="max-w-4xl px-4 py-6 mx-auto flex flex-col gap-6">
                    {messages.map((msg) => {
                        let contentToRender = "";
                        if (msg.role === 'user') {
                            contentToRender = msg.parts ? msg.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('\n') : "";
                            if (!contentToRender && (msg as any).text) contentToRender = (msg as any).text;
                        } else {
                            contentToRender = msg.parts ? msg.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('\n') : "";
                            if (!contentToRender && (msg as any).text) contentToRender = (msg as any).text;
                        }

                        // Support mapping from initial db messages where we manually mapped `content` directly
                        if (!contentToRender && (msg as any).content) contentToRender = (msg as any).content;

                        // Pre-process LLM's LaTeX delimiters (\[ \], \( \)) into standard Markdown standard ($$, $) for remark-math
                        contentToRender = contentToRender
                            .replace(/\\\[/g, '$$$$')
                            .replace(/\\\]/g, '$$$$')
                            .replace(/\\\(/g, '$')
                            .replace(/\\\)/g, '$');

                        return (
                            <React.Fragment key={msg.id}>
                                <Message from={msg.role as any}>
                                    <MessageContent>
                                        {msg.role === 'user' ? (
                                            <div className="whitespace-pre-wrap">{contentToRender}</div>
                                        ) : (
                                            <MessageResponse>{contentToRender}</MessageResponse>
                                        )}
                                    </MessageContent>
                                </Message>
                            </React.Fragment>
                        )
                    })}

                    {isLoading && messages[messages.length - 1]?.role === 'user' && (
                        <Message from="assistant">
                            <MessageContent>
                                <div className="flex items-center gap-2">
                                    <Image src="/ai-loading.gif" alt="AI Loading" width={24} height={24} className="rounded-full" unoptimized />
                                    <span className="text-sm text-gray-500">Thinking...</span>
                                </div>
                            </MessageContent>
                        </Message>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="w-full absolute bottom-0 left-0 md:pb-6 z-20">
                <PromptInput
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                />
            </div>

            <ShareDialog
                open={isShareOpen}
                onOpenChange={setIsShareOpen}
                chatId={chatId}
                isSharedInitial={isSharedInitial}
            />
        </div>
    );
};
