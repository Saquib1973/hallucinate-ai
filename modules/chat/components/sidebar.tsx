"use client";

import { UserButton } from '@/modules/authentication/components/user-button';
import {
    ArrowUpRight,
    Menu,
    Plus,
    X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <>
            <div className="md:hidden fixed top-0 left-0 w-full h-14 transition-all duration-500 flex items-center px-4 z-40">
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
            <aside className={`fixed md:relative top-0 left-0 z-50 md:z-0 h-screen bg-gray-100 md:bg-gray-50 flex flex-col pt-6 pb-4 px-4 border-r border-gray-100 flex-shrink-0 w-[80%] md:w-[280px] md:shadow-none transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>

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

                {/* Chat History */}
                <div className="flex-1 overflow-y-auto no-scrollbar py-2 mr-[-4px] pr-[4px]">
                    <div className="mb-6">
                        <h3 className="text-xs font-medium text-gray-400 px-3 mb-3">Today</h3>
                        <div className="flex flex-col gap-1">
                            <Link href="/chat/1" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100/50 rounded-xl transition truncate">
                                <span className="truncate">What to wear kayaking</span>
                            </Link>
                            <Link href="/chat/2" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100/50 rounded-xl transition truncate">
                                <span className="truncate">Redux code example</span>
                            </Link>
                            <Link href="/chat/3" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100/50 rounded-xl transition truncate">
                                <span className="truncate">Basketball player image</span>
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-medium text-gray-400 px-3 mb-3">Yesterday</h3>
                        <div className="flex flex-col gap-1">
                            <Link href="/chat/4" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100/50 rounded-xl transition truncate">
                                <span className="truncate">React JS code library</span>
                            </Link>
                            <Link href="/chat/5" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100/50 rounded-xl transition truncate">
                                <span className="truncate">Plan for travel in Barcelona</span>
                            </Link>
                            <Link href="/chat/6" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100/50 rounded-xl transition truncate">
                                <span className="truncate">Naming color variants</span>
                            </Link>
                            <Link href="/chat/7" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100/50 rounded-xl transition truncate">
                                <span className="truncate">Academic writing example</span>
                            </Link>
                        </div>
                    </div>

                    <Link href="/chats" className="flex items-center gap-2 px-3 mt-4 text-xs font-medium text-gray-500 hover:text-gray-900 transition">
                        <span>Show all chats.</span>
                        <ArrowUpRight className="size-3.5" />
                    </Link>
                </div>

                {/* Footer User Button */}
                <div className="mt-auto pt-2 border-t border-gray-100/50 -mx-2 px-2 pb-2">
                    <UserButton />
                </div>
            </aside>
        </>
    );
};
