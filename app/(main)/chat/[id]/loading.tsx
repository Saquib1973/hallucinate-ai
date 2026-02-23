import { Loader } from 'lucide-react';

const Loading = () => {
    return (
        <div className="flex flex-col h-full relative">
            <div className="flex-1 h-full overflow-y-auto px-8 pt-20 pb-48 scrollbar-hide">
                <div className="max-w-4xl px-4 mx-auto text-gray-400 flex flex-col items-center justify-center gap-6">
                    <Loader className='animate-pulse size-5 animate-spin' />
                    <h1>Loading your chat</h1>
                </div>
            </div>

            <div className="w-full absolute bottom-0 left-0 md:pb-6 z-20">
                <div className="w-full max-w-4xl mx-auto max-md:p-4 mt-auto">
                    <div className="bg-white rounded-3xl p-3 max-md:pt-3 max-md:pb-5 border border-gray-100 shadow-sm animate-pulse">
                        <div className="flex flex-col min-h-[40px]">
                            <div className="flex items-start gap-2 relative">
                                <div className="w-full pt-3 px-4 min-h-[50px]">
                                    <div className="h-4 bg-gray-100 rounded-md w-48"></div>
                                </div>
                                <div className="bg-gray-100 rounded-full w-8 h-8 absolute right-2 top-2 shrink-0"></div>
                            </div>

                            <div className="flex items-center justify-between pt-8 px-2">
                                <div className="w-32 h-6 bg-gray-100 rounded-md"></div>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-5 bg-gray-100 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loading;