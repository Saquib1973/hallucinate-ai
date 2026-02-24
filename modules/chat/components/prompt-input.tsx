"use client";

import { useAiModels } from '@/modules/ai-agent/hook/ai-agent';
import { motion } from 'framer-motion';
import { AudioLines, ChevronDown, Lightbulb, Loader, Paperclip, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { useCreateChat } from '../hooks/chat';
import ModelSelector from './model-selector';

export const PromptInput = ({
    input,
    handleInputChange,
    onSubmit,
    isLoading: externalIsLoading
}: {
    input?: string;
    handleInputChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSubmit?: (e: React.FormEvent, model: string, content: string) => void;
    isLoading?: boolean;
} = {}) => {
    const [selectedModelId, setSelectedModelId] = useState<string>('');
    const [internalMessage, setInternalMessage] = useState("")

    const { data: models = [], isLoading, isFetching, refetch } = useAiModels();

    const { mutateAsync, isPending: isChatPending } = useCreateChat();

    // Set default model once loaded
    React.useEffect(() => {
        if (models.length > 0 && !selectedModelId) {
            setSelectedModelId(models[0].id);
        }
    }, [models, selectedModelId]);

    const activeModel = models.find((m: any) => m.id === selectedModelId);

    const message = input !== undefined ? input : internalMessage;
    const isPending = externalIsLoading || isChatPending;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (onSubmit) {
            onSubmit(e, selectedModelId, message);
            if (!handleInputChange) setInternalMessage("");
            return;
        }

        try {
            await mutateAsync({
                model: selectedModelId,
                content: message,
            });

        } catch (error) {
            console.error("Error creating chat", error)
        } finally {
            setInternalMessage("")
        }


    }

    return (
        <motion.div layoutId="prompt-input-wrapper" className="w-full max-xl:px-10 max-w-[920px] mx-auto flex flex-col relative z-20 max-md:px-4 max-md:pb-4">
            <div className="bg-white rounded-[32px] p-2 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100/80">
                <div className="flex flex-col">
                    <div className="px-3 pt-4 pb-2">
                        <textarea
                            placeholder="What do you want to design?"
                            className="w-full bg-transparent border-none outline-none resize-none text-gray-800 placeholder:text-gray-400 min-h-[44px] overflow-hidden leading-relaxed text-[16px] font-medium"
                            rows={1}
                            value={message}
                            onChange={(e) => {
                                if (handleInputChange) {
                                    handleInputChange(e);
                                } else {
                                    setInternalMessage(e.target.value);
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    if (message.trim() && !isPending) {
                                        handleSubmit(e as any);
                                    }
                                }
                            }}
                        />
                    </div>

                    <div className="flex items-center justify-between px-2 pb-2 mt-2">
                        {/* Left side actions */}
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                            <button type="button" className="p-2.5 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-50 shrink-0">
                                <Paperclip className="size-4" strokeWidth={2.5} />
                            </button>

                            <button type="button" className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-[13px] font-medium text-gray-700 transition-colors shrink-0">
                                <Paperclip className="size-3.5" />
                                Design Style
                                <ChevronDown className="size-3.5 text-gray-400" />
                            </button>

                            <button type="button" className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#E5F0FF] text-[#0066FF] text-[13px] font-medium transition-colors shrink-0">
                                <Lightbulb className="size-3.5" />
                                Ideas
                            </button>
                        </div>

                        {/* Right side actions */}
                        <div className="flex items-center gap-2 pl-2 shrink-0">
                            <ModelSelector
                                models={models}
                                isLoadingModel={isLoading || isFetching}
                                selectedModelId={selectedModelId}
                                onModelSelect={setSelectedModelId}
                                refetch={() => refetch()}
                                className="border-none shadow-none bg-white font-medium hover:bg-gray-50 text-[13px]"
                                icon={<Sparkles className="size-3.5 text-black" />}
                            />

                            <button onClick={handleSubmit} disabled={isPending || !message.trim()} className="disabled:opacity-50 disabled:cursor-not-allowed bg-[#222222] hover:bg-black transition-colors cursor-pointer text-white rounded-[20px] px-4 py-2 flex items-center justify-center shrink-0 min-w-[50px]">
                                {
                                    isPending ? <Loader className="size-4 animate-spin" /> :
                                        <AudioLines className="size-4 text-white" />
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
