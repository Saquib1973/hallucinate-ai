"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

const ModelSelector = ({
    models = [],
    selectedModelId,
    onModelSelect,
    isLoadingModel,
    refetch,
    className = "",
    icon

}: {
    models: any[];
    selectedModelId: string;
    onModelSelect: (modelId: string) => void;
    isLoadingModel: any;
    className?: string;
    refetch: () => void;
    icon?: React.ReactNode;
}) => {

    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedModel = models.find((m: any) => m.id === selectedModelId) || models[0];

    const formatContextLength = (length: number) => {
        if (!length) return 'Unknown';
        if (length >= 1000000) return `${(length / 1000000).toFixed(1)}M`;
        if (length >= 1000) return `${(length / 1000).toFixed(0)}K`;
        return `${length}`;
    }

    const isModelFree = (model: any) => {
        return !!model?.pricing && parseFloat(model.pricing.prompt) === 0 && parseFloat(model.pricing.completion) === 0;
    }

    const filteredModels = useMemo(() => {
        if (!searchQuery) return models;
        const query = searchQuery.toLowerCase();
        return models.filter((m: any) => m.name.toLowerCase().includes(query) || m.id.toLowerCase().includes(query));
    }, [models, searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchQuery("");
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    if (isLoadingModel) {
        return (
            <div className={`flex bg-gray-100 px-3 py-2 rounded-full w-[160px] animate-pulse h-[32px] items-center gap-2 ${className}`} />
        )
    } else if (!models || models.length === 0) {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <h3 className='text-xs text-gray-400'>No model available.</h3>
                <button onClick={refetch} className='text-xs text-gray-600 hover:text-gray-800 underline cursor-pointer'>Reload</button>
            </div>
        )
    }

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>

            {/* Popup Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center gap-2 bg-gray-50 border border-gray-100 duration-500 cursor-pointer rounded-full px-3 py-2 transition-all outline-none
                    ${isOpen ? 'border-gray-200 bg-gray-100' : ''}
                    `}
            >
                {icon && <span className="flex items-center justify-center">{icon}</span>}
                <span className="text-xs font-medium truncate max-w-[100px] md:max-w-[150px]">
                    {selectedModel?.name || "Select Model"}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''} shrink-0`} />
            </button>

            {/* Popup Content */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ y: 10, scale: 0.95 }}
                            animate={{ y: 0, scale: 1 }}
                            exit={{ y: 10, scale: 0.95, transition: { duration: 0.05 } }}
                            transition={{ duration: 0.10, ease: "easeOut" }}
                            className="fixed inset-x-0 bottom-0 z-50 w-full bg-gray-50 md:bg-white border-gray-100 max-md:border-t border rounded-t-3xl flex flex-col md:h-[350px] h-[80vh] pb-6 md:pb-0 md:absolute md:bottom-full md:left-0 md:inset-x-auto md:w-80 md:mb-2 md:rounded-2xl md:shadow-sm md:overflow-hidden md:origin-bottom-left origin-bottom"
                        >
                            {/* Drag handle for mobile */}
                            <div className="w-full flex justify-center py-3 md:hidden shrink-0" onClick={() => setIsOpen(false)}>
                                <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                            </div>

                            <div className="p-4 pt-1 md:p-3 sticky top-0 z-10 shrink-0">
                                <div className="relative flex items-center">
                                    <Search className="size-4 text-gray-400 absolute left-3" />
                                    <input
                                        type="text"
                                        placeholder="Search models..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-white md:bg-gray-50 border border-transparent text-sm rounded-xl py-2.5 md:py-2 pl-9 pr-3 outline-none transition-all placeholder:text-gray-400"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="p-2 px-4 md:px-2 overflow-y-auto custom-scrollbar">
                                <div className="flex flex-col">
                                    {/* No Filtered Models */}
                                    {filteredModels.length === 0 ? (
                                        <div className="text-sm text-gray-500 text-center py-6">
                                            No models found for "{searchQuery}"
                                        </div>
                                    ) : (

                                        // Filtered Models list
                                        filteredModels.map((model: any) => (
                                            <button
                                                key={model.id}
                                                type="button"
                                                onClick={() => {
                                                    onModelSelect(model.id);
                                                    setIsOpen(false);
                                                }}
                                                className={`flex cursor-pointer items-start gap-3 w-full text-left px-2 py-1.5 transition-all ${selectedModelId === model.id
                                                    ? 'bg-gray-100'
                                                    : 'hover:bg-gray-50 border border-transparent'
                                                    }`}
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2 mb-0.5">
                                                        <span className={`text-sm font-medium truncate ${selectedModelId === model.id ? 'text-black' : 'text-gray-700'}`}>
                                                            {model.name}
                                                        </span>
                                                        {isModelFree(model) && (
                                                            <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-800 shrink-0 border border-green-200">
                                                                FREE
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <span className="truncate max-w-[110px]">
                                                            {model.top_provider?.is_moderated ? 'Moderated' : 'Unmoderated'}
                                                        </span>
                                                        <span className="text-gray-300">•</span>
                                                        <span>{formatContextLength(model.context_length)} ctx</span>
                                                    </div>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ModelSelector;