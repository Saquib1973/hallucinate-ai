import { PromptInput } from '@/modules/chat/components/prompt-input';

interface ChatPageProps {
    params: Promise<{ id: string }>;
}

const ChatPage = async ({ params }: ChatPageProps) => {
    const resolvedParams = await params;

    return (
        <div className="flex flex-col h-full relative">


            <div className="flex-1 h-full overflow-y-auto px-8 pt-6 pb-48 scrollbar-hide">
                <div className="hidden h-14 absolute inset-0 !bg-red-400 border-b border-gray-100/60 flex items-center px-6 sticky top-0 bg-white/80 backdrop-blur-sm z-30">
                    <h2 className="text-sm font-semibold text-gray-800">Chat Session #{resolvedParams.id}</h2>
                </div>
                <div className="max-w-4xl px-4 mx-auto flex flex-col gap-6">
                    {/* User Message */}
                    <div className="flex justify-end">
                        <div className="bg-gray-100 text-gray-800 px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm text-[15px] leading-relaxed">
                            Hello, I need help with writing a cover letter for a software engineering position.
                        </div>
                    </div>

                    {/* AI Message */}
                    <div className="flex justify-start items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-black flexItems-center justify-center flex-shrink-0 mt-1">
                            <div className="w-4 h-4 border-[2px] border-white rounded-full"></div>
                        </div>
                        <div className="bg-white border border-gray-100 px-5 py-4 rounded-3xl rounded-tl-sm max-w-[85%] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] text-[15px] leading-relaxed text-gray-700">
                            <p className="mb-4">Hello! I'd be happy to help you write a cover letter. To make it stand out, it would be helpful to have a few more details:</p>
                            <ul className="list-disc pl-5 space-y-2 mb-4 text-gray-600">
                                <li>What company are you applying to?</li>
                                <li>What specific technologies or languages are they looking for?</li>
                                <li>Do you have any standout projects or accomplishments you'd like to highlight?</li>
                            </ul>
                            <p>Alternatively, if you have your resume or a job description, you can attach them below!</p>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <div className="bg-gray-100 text-gray-800 px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm text-[15px] leading-relaxed">
                            Hello, I need help with writing a cover letter for a software engineering position.
                        </div>
                    </div>

                    {/* AI Message */}
                    <div className="flex justify-start items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-black flexItems-center justify-center flex-shrink-0 mt-1">
                            <div className="w-4 h-4 border-[2px] border-white rounded-full"></div>
                        </div>
                        <div className="bg-white border border-gray-100 px-5 py-4 rounded-3xl rounded-tl-sm max-w-[85%] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] text-[15px] leading-relaxed text-gray-700">
                            <p className="mb-4">Hello! I'd be happy to help you write a cover letter. To make it stand out, it would be helpful to have a few more details:</p>
                            <ul className="list-disc pl-5 space-y-2 mb-4 text-gray-600">
                                <li>What company are you applying to?</li>
                                <li>What specific technologies or languages are they looking for?</li>
                                <li>Do you have any standout projects or accomplishments you'd like to highlight?</li>
                            </ul>
                            <p>Alternatively, if you have your resume or a job description, you can attach them below!</p>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <div className="bg-gray-100 text-gray-800 px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm text-[15px] leading-relaxed">
                            Hello, I need help with writing a cover letter for a software engineering position.
                        </div>
                    </div>

                    {/* AI Message */}
                    <div className="flex justify-start items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-black flexItems-center justify-center flex-shrink-0 mt-1">
                            <div className="w-4 h-4 border-[2px] border-white rounded-full"></div>
                        </div>
                        <div className="bg-white border border-gray-100 px-5 py-4 rounded-3xl rounded-tl-sm max-w-[85%] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] text-[15px] leading-relaxed text-gray-700">
                            <p className="mb-4">Hello! I'd be happy to help you write a cover letter. To make it stand out, it would be helpful to have a few more details:</p>
                            <ul className="list-disc pl-5 space-y-2 mb-4 text-gray-600">
                                <li>What company are you applying to?</li>
                                <li>What specific technologies or languages are they looking for?</li>
                                <li>Do you have any standout projects or accomplishments you'd like to highlight?</li>
                            </ul>
                            <p>Alternatively, if you have your resume or a job description, you can attach them below!</p>
                        </div>
                    </div>
                </div>
            </div>


            <div className="w-full absolute bottom-0 left-0md:pb-6 z-20">
                <PromptInput />
            </div>

        </div>
    );
};

export default ChatPage;