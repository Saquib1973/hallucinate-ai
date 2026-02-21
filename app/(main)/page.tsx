import React from 'react';
import { PromptInput } from '@/modules/chat/components/prompt-input';
import { FileText, GraduationCap, Image as ImageIcon, Code, Lightbulb } from 'lucide-react';

const ChatHomePage = () => {
    return (
        <div className="flex-1 flex flex-col h-full bg-white relative">
            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center pt-20 pb-10 px-8 overflow-y-auto w-full">

                {/* Header Section */}
                <div className="flex flex-col items-center text-center mb-16 max-w-2xl mx-auto">
                    <div className="w-12 h-12 mb-6 bg-black rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 border-4 border-white rounded-full"></div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">Welcome to HallucinateAI</h1>
                    <p className="text-gray-500 text-[15px]">Your personal and expert AI assistant for pretty much any tasks you can imagine</p>
                </div>

                {/* Suggestion Cards */}
                <div className="flex gap-4 p-4 mb-20 overflow-x-auto w-full max-w-5xl justify-center touch-pan-x snap-x pb-8">
                    {/* General Writing */}
                    <div className="flex-shrink-0 w-[200px] h-[160px] bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] transition-all cursor-pointer group snap-center flex flex-col justify-between hover:-translate-y-1">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <FileText size={18} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-blue-500 mb-1 text-sm">General writing</h3>
                            <p className="text-gray-400 text-xs leading-relaxed">Comprehensive writing assistance for all needs</p>
                        </div>
                    </div>

                    {/* Academic Writing */}
                    <div className="flex-shrink-0 w-[200px] h-[160px] bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] transition-all cursor-pointer group snap-center flex flex-col justify-between hover:-translate-y-1">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <GraduationCap size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-indigo-500 mb-1 text-sm">Academic writing</h3>
                            <p className="text-gray-400 text-xs leading-relaxed">Achieve 4.0 grades with Clarity help</p>
                        </div>
                    </div>

                    {/* Generate Image */}
                    <div className="flex-shrink-0 w-[200px] h-[160px] bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] transition-all cursor-pointer group snap-center flex flex-col justify-between hover:-translate-y-1">
                        <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <ImageIcon size={18} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-orange-500 mb-1 text-sm">Generate image</h3>
                            <p className="text-gray-400 text-xs leading-relaxed">Create stunning images by Clarity AI</p>
                        </div>
                    </div>

                    {/* Code Snippet */}
                    <div className="flex-shrink-0 w-[200px] h-[160px] bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] transition-all cursor-pointer group snap-center flex flex-col justify-between hover:-translate-y-1">
                        <div className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <Code size={18} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-red-500 mb-1 text-sm">Code snippet</h3>
                            <p className="text-gray-400 text-xs leading-relaxed">Get instant, efficient coding solutions</p>
                        </div>
                    </div>

                    {/* Get Idea */}
                    <div className="flex-shrink-0 w-[200px] h-[160px] bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] transition-all cursor-pointer group snap-center flex flex-col justify-between hover:-translate-y-1">
                        <div className="w-8 h-8 rounded-xl bg-green-50 text-green-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <Lightbulb size={18} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-green-500 mb-1 text-sm">Get an idea</h3>
                            <p className="text-gray-400 text-xs leading-relaxed">Inspire creativity with innovative suggestions</p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Input Footer */}
            <div className="w-full z-20">
                <PromptInput />
            </div>
        </div>
    );
};

export default ChatHomePage;