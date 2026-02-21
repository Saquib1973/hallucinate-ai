"use client";

import { useAiModels } from '@/modules/ai-agent/hook/ai-agent';
import { ArrowUp } from 'lucide-react';
import React, { useState } from 'react';
import ModelSelector from './model-selector';

export const PromptInput = () => {
    const [selectedModelId, setSelectedModelId] = useState<string>('');

    const { data: models = [], isLoading, isFetching, refetch } = useAiModels();

    // Set default model once loaded
    React.useEffect(() => {
        if (models.length > 0 && !selectedModelId) {
            setSelectedModelId(models[0].id);
        }
    }, [models, selectedModelId]);

    const activeModel = models.find((m: any) => m.id === selectedModelId);

    return (
        <div className="w-full max-w-4xl mx-auto max-md:p-4 mt-auto">

            <div className="bg-white rounded-3xl p-3 max-md:pt-3 max-md:pb-5 border border-gray-200">
                <div className="flex flex-col min-h-[40px]">
                    <div className="flex items-start gap-2 relative">
                        <textarea
                            placeholder="What's in your mind or clipboard?"
                            className="w-full bg-transparent border-none outline-none resize-none pt-3 px-4 text-gray-800 placeholder:text-gray-400 min-h-[50px] overflow-hidden leading-relaxed"
                            rows={1}
                        />
                        <button className="bg-black cursor-pointer text-white rounded-full p-2 absolute right-2 top-2">
                            <ArrowUp className="size-4 rotate-45 text-white" strokeWidth={3} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between pt-8 px-2">
                        <ModelSelector
                            models={models}
                            isLoadingModel={isLoading || isFetching}
                            selectedModelId={selectedModelId}
                            onModelSelect={setSelectedModelId}
                            refetch={() => refetch()}
                        />

                        <div className="flex items-center gap-4">
                            <span className="text-[11px] text-gray-400 font-medium bg-gray-50 border border-gray-100 px-2 py-1 rounded-full">
                                {activeModel ? `${(activeModel.context_length || 0).toLocaleString()} ctx` : ''}
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
