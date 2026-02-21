"use client"
import { Search } from 'lucide-react';

export const ChatsPage = () => {
    // Dummy data matching the user's provided screenshot
    const chatHistory = [
        { id: 1, title: 'Lesson Status Indicator Improvement', time: '11 months ago' },
        { id: 2, title: 'Redesigning YouTube Bulk Upload UI', time: '11 months ago' },
        { id: 3, title: 'FAQ Slide Animation Implementation', time: '11 months ago' },
        { id: 4, title: 'Persistent React Navbar Dropdown', time: '11 months ago' },
        { id: 5, title: 'Troubleshooting React Hooks Error', time: '11 months ago' },
        { id: 6, title: 'TypeScript Error in Next.js Build', time: '11 months ago' },
        { id: 7, title: 'Enhancing the Loading Experience', time: '11 months ago' },
        { id: 8, title: 'Styling Sonner Toast to Match SecondaryButton Design', time: '11 months ago' },
        { id: 9, title: 'Designing a Reusable React Button Component', time: '11 months ago' },
    ];

    return (
        <div className="flex-1 flex flex-col h-full text-gray-900 relative overflow-hidden md:rounded-l-[2rem]">
            {/* Header Area */}
            <div className="px-6 md:px-12 pt-10 pb-4 flex-shrink-0">


                {/* Search Bar */}
                <div className="max-w-5xl mx-auto relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-gray-400 group-focus-within:text-white transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search your chats..."
                        className="w-full border focus:outline-none focus:border-gray-200 border-gray-100 rounded-full py-3 pl-12 pr-4 text-sm placeholder:text-gray-500"
                    />
                </div>
            </div>

            {/* Scrollable Chat List */}
            <div className="flex-1 overflow-y-auto px-6 md:px-12 pb-20 custom-scrollbar">
                <div className="max-w-5xl mx-auto flex flex-col">
                    {chatHistory.map((chat) => (
                        <div
                            key={chat.id}
                            className="group flex flex-col justify-center py-4 hover:bg-gray-50 hover:-mx-4 hover:px-4 rounded-xl transition-all cursor-pointer"
                        >
                            <h3 className="text-[15px] font-medium text-gray-900 mb-1 leading-snug truncate">
                                {chat.title}
                            </h3>
                            <p className="text-xs text-gray-500">
                                Last message {chat.time}
                            </p>
                        </div>
                    ))}

                    {/* Show More Button */}
                    <div className="mt-8 mb-4">
                        <button className="text-sm font-medium text-gray-600 transition-colors focus:outline-none hover:text-black cursor-pointer">
                            Show more chats
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatsPage;