"use client";

import { UserButton } from '@/modules/authentication/components/user-button';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useChatStore } from '../store/chat-store';
import { RecentChats } from './recent-chats';

export const Sidebar = ({ chats: initialChats }: { chats: any }) => {
    const { loadChats } = useChatStore();
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        loadChats();
    }, [loadChats]);

    return (
        <>
            <div className="md:hidden fixed max-md:bg-white top-0 left-0 w-full h-14 transition-all duration-500 flex items-center px-4 z-40">
                <button onClick={() => setIsOpen(true)} className="p-2 -ml-2 text-black transition">
                    <Menu className="size-5" />
                </button>
                <div className="flex items-center gap-2 ml-2">
                    <span className="font-semibold text-lg text-gray-900 tracking-tight">Hallucinate AI</span>
                </div>
            </div>

            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-gray-50/80 z-40 transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`fixed md:relative top-0 left-0 z-50 md:z-0 h-screen bg-gray-100 md:bg-gray-50 flex flex-col pt-6 pb-4 px-2 border-r border-gray-100 flex-shrink-0 w-[80%] md:w-[280px] md:shadow-none transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>

                {/* Brand & Pro Badge */}
                <div className="flex items-center justify-between mb-8 px-2">
                    <Link href="/" className="font-semibold text-lg text-gray-900 tracking-tight hidden md:block">HallucinateAI</Link>
                    <Link href="/" className="font-semibold text-lg text-gray-900 tracking-tight md:hidden">Menu</Link>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setIsOpen(false)} className="md:hidden  -mr-2">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <RecentChats initialChats={initialChats} />

                {/* Footer User Button */}
                <div className="mt-auto pt-2 border-t border-gray-100/50 -mx-2 px-2 pb-2">
                    <UserButton />
                </div>
            </aside>
        </>
    );
};
