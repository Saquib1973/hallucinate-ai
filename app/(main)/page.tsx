import { PromptInput } from '@/modules/chat/components/prompt-input';
import { AppWindow, ArrowRight, Figma, Hourglass, LayoutTemplate, Lightbulb, MonitorSmartphone, Smile } from 'lucide-react';
import React from 'react';
import AnimatePageWrapper from '@/components/animate-page-wrapper';

const SuggestionItem = ({ icon, text, active }: { icon: React.ReactNode, text: string, active?: boolean }) => {
    return (
        <div className={`flex items-center gap-4 p-3.5 rounded-2xl cursor-pointer transition-all group ${active ? 'bg-gray-100/70 border border-transparent' : 'hover:bg-gray-50 border border-transparent'}`}>
            <div className="text-gray-600 shrink-0">
                {icon}
            </div>
            <p className={`text-[15px] flex-1 truncate ${active ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>{text}</p>
            {active && (
                <div className="text-gray-900 shrink-0 transition-transform">
                    <ArrowRight className="size-5" />
                </div>
            )}
            {!active && (
                <div className="text-gray-400 opacity-0 group-hover:opacity-100 shrink-0 transition-opacity">
                    <ArrowRight className="size-5" />
                </div>
            )}
        </div>
    )
}

const ChatHomePage = () => {
    return (
        <AnimatePageWrapper duration={0.4} className="flex-1 flex flex-col h-full bg-[#fefefe] relative">
            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center pt-20 pb-20 px-4 md:px-8 overflow-y-auto w-full">

                {/* Header Section */}
                <div className="flex flex-col items-center text-center w-full max-w-3xl mx-auto mb-10 relative">

                    <h1 className="text-4xl md:text-[44px] leading-tight font-medium text-gray-900 tracking-tight">
                        Turn your <span className="font-semibold">ideas</span> into <span className="font-semibold">interfaces</span>
                    </h1>
                </div>

                <div className="w-full flex justify-center max-w-[920px] mx-auto relative z-10 gap-3">
                    <div className="w-full flex items-center justify-center">
                        <PromptInput />
                    </div>
                </div>

                <div className="w-full max-w-[920px] flex flex-col items-center relative z-10 gap-3 mt-4">
                    {/* Suggestions Card */}
                    <div className="w-full bg-[#f9f9f9]/80 rounded-[32px] p-2 border border-gray-100 shadow-sm flex flex-col mt-4">
                        {/* Header Tabs */}
                        <div className="flex items-center gap-1.5 p-2 overflow-x-auto no-scrollbar border-b border-gray-200/50 pb-4">
                            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200/70 rounded-full text-[14px] font-medium text-gray-900 shrink-0 transition-colors cursor-pointer">
                                <Lightbulb size={16} /> Suggested
                            </button>
                            <button className="flex items-center justify-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100/50 rounded-full text-[14px] font-medium transition-colors shrink-0 cursor-pointer">
                                <LayoutTemplate size={16} strokeWidth={1.5} /> Wireframe
                            </button>
                            <button className="flex items-center justify-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100/50 rounded-full text-[14px] font-medium transition-colors shrink-0 cursor-pointer">
                                <MonitorSmartphone size={16} strokeWidth={1.5} /> Apps
                            </button>
                            <button className="flex items-center justify-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100/50 rounded-full text-[14px] font-medium transition-colors shrink-0 cursor-pointer">
                                <AppWindow size={16} strokeWidth={1.5} /> Websites
                            </button>
                            <button className="flex items-center justify-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100/50 rounded-full text-[14px] font-medium transition-colors shrink-0 cursor-pointer">
                                <Figma size={16} strokeWidth={1.5} /> Prototype
                            </button>
                        </div>

                        {/* List */}
                        <div className="flex flex-col p-2 gap-1 mt-2">
                            <SuggestionItem icon={<LayoutTemplate size={20} className="text-gray-500" strokeWidth={1.5} />} text="A developer portfolio with dark theme, project cards, and contact form." />
                            <SuggestionItem icon={<Hourglass size={20} className="text-gray-900" strokeWidth={1.5} />} text="A modern SaaS landing page for a time-tracking app." active />
                            <SuggestionItem icon={<Smile size={20} className="text-gray-500" strokeWidth={1.5} />} text="An e-commerce homepage for a skincare brand." />
                        </div>
                    </div>
                </div>

            </div>
        </AnimatePageWrapper>
    );
};

export default ChatHomePage;