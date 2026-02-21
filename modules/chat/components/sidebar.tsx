"use client";

import { UserButton } from '@/modules/authentication/components/user-button';
import {
    ArrowUpRight,
    Menu,
    X,
    Pencil,
    Trash2,
    Check,
    MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { useChatStore } from '../store/chat-store';
import { useDeleteChat, useUpdateChatTitle } from '../hooks/chat';
import { Button } from '@/components/ui/button';

export const Sidebar = ({ chats: initialChats }: { chats: any }) => {
    const { activeChatId, chats, loadChats, loading } = useChatStore();
    const [selectedChatId, setSelectedChatId] = useState(activeChatId);
    const [isOpen, setIsOpen] = useState(false);

    // Rename and Delete states
    const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState("");
    const [chatToDelete, setChatToDelete] = useState<any | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const pathname = usePathname();
    const router = useRouter();

    const deleteChatMutation = useDeleteChat(chatToDelete?.id || "");
    const updateChatTitleMutation = useUpdateChatTitle(renamingChatId || "", renameValue);

    const handleDelete = () => {
        if (!chatToDelete) return;
        deleteChatMutation.mutate(undefined, {
            onSuccess: () => {
                if (pathname === `/chat/${chatToDelete.id}`) {
                    router.push("/");
                }
                setChatToDelete(null);
            }
        });
    };

    const handleRenameSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!renameValue.trim()) {
            setRenamingChatId(null);
            return;
        }
        updateChatTitleMutation.mutate(undefined, {
            onSuccess: () => {
                setRenamingChatId(null);
            }
        });
    };

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        loadChats();
    }, [loadChats]);

    const displayChats = chats.length > 0 ? chats : (initialChats || []);

    const groupedChats = useMemo(() => {
        const today: any[] = [];
        const yesterday: any[] = [];
        const previous7Days: any[] = [];
        const older: any[] = [];

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        (displayChats || []).forEach((chat: any) => {
            if (!chat.createdAt) return;
            const date = new Date(chat.createdAt);
            date.setHours(0, 0, 0, 0);

            const timeDiff = now.getTime() - date.getTime();
            const diffDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
                today.push(chat);
            } else if (diffDays === 1) {
                yesterday.push(chat);
            } else if (diffDays <= 7) {
                previous7Days.push(chat);
            } else {
                older.push(chat);
            }
        });

        return { today, yesterday, previous7Days, older };
    }, [displayChats]);

    const renderChatGroup = (title: string, group: any[]) => {
        if (group.length === 0) return null;
        return (
            <div className="mb-6">
                <h3 className="text-xs font-medium text-gray-400 px-3 mb-3">{title}</h3>
                <div className="flex flex-col gap-1">
                    {group.map((chat: any) => {
                        const isActive = pathname === '/chat/' + chat.id;
                        const isRenaming = renamingChatId === chat.id;

                        return (
                            <div key={chat.id} className={`group relative flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:bg-gray-100/50 rounded-xl transition ${isActive ? 'bg-gray-100/50 font-medium text-gray-900' : ''}`}>
                                {isRenaming ? (
                                    <form onSubmit={handleRenameSubmit} className="flex-1 flex items-center gap-2">
                                        <input
                                            type="text"
                                            autoFocus
                                            value={renameValue}
                                            onChange={(e) => setRenameValue(e.target.value)}
                                            className="w-full text-xs bg-white border border-gray-200 rounded px-2 py-1 outline-none focus:border-blue-500"
                                            onBlur={() => {
                                                // slight delay to allow form submission if checkmark is clicked
                                                setTimeout(() => setRenamingChatId(null), 150);
                                            }}
                                            disabled={updateChatTitleMutation.isPending}
                                        />
                                        <button
                                            type="submit"
                                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                                            disabled={updateChatTitleMutation.isPending}
                                        >
                                            <Check className="size-3.5" />
                                        </button>
                                    </form>
                                ) : (
                                    <>
                                        <Link href={`/chat/${chat.id}`} className="flex-1 truncate block pr-12">
                                            {chat.title || "New Chat"}
                                        </Link>
                                        <div className={`absolute right-2 items-center gap-1 bg-gradient-to-l from-gray-100/90 via-gray-100/80 to-transparent pl-6 flex ${openMenuId === chat.id ? 'flex md:flex' : 'flex md:hidden md:group-hover:flex'}`}>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setOpenMenuId(openMenuId === chat.id ? null : chat.id);
                                                }}
                                                className="p-1.5 text-gray-500 hover:text-gray-900 transition bg-white/50 backdrop-blur-sm rounded-md shadow-sm border border-black/5 hover:border-gray-300"
                                            >
                                                <MoreHorizontal className="size-4" />
                                            </button>
                                        </div>

                                        {openMenuId === chat.id && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-[60]"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setOpenMenuId(null);
                                                    }}
                                                />
                                                <div className="absolute right-2 top-9 bg-white rounded-xl shadow-lg shadow-black/5 border border-gray-100 p-1 z-[70] flex flex-col gap-0.5 min-w-[124px]">
                                                    <Button
                                                        variant="ghost"
                                                        fullWidth
                                                        className="justify-start px-3 h-9 text-sm text-gray-700"
                                                        onClick={(e: React.MouseEvent) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            setOpenMenuId(null);
                                                            setRenamingChatId(chat.id);
                                                            setRenameValue(chat.title || "");
                                                        }}
                                                    >
                                                        <Pencil className="size-3.5 mr-2" /> Rename
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        fullWidth
                                                        className="justify-start px-3 h-9 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                                                        onClick={(e: React.MouseEvent) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            setOpenMenuId(null);
                                                            setChatToDelete(chat);
                                                        }}
                                                    >
                                                        <Trash2 className="size-3.5 mr-2" /> Delete
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

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
                    {loading && displayChats.length === 0 ? (
                        <div className="px-3 text-sm text-gray-400 flex py-4">Loading chats...</div>
                    ) : (
                        <>
                            {renderChatGroup("Today", groupedChats.today)}
                            {renderChatGroup("Yesterday", groupedChats.yesterday)}
                            {renderChatGroup("Previous 7 Days", groupedChats.previous7Days)}
                            {renderChatGroup("Older", groupedChats.older)}
                            {displayChats.length === 0 && (
                                <div className="px-3 text-sm text-gray-400 py-4">No recent chats</div>
                            )}
                        </>
                    )}

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

            {/* Delete Confirmation Modal */}
            {chatToDelete && (
                <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Chat</h3>
                            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                Are you sure you want to delete <span className="font-medium text-gray-800">"{chatToDelete.title || "New Chat"}"</span>? This action cannot be undone.
                            </p>
                            <div className="flex justify-end gap-3 mt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setChatToDelete(null)}
                                    disabled={deleteChatMutation.isPending}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="!bg-red-600 hover:!bg-red-700 text-white shadow-sm shadow-red-200 border-none flex items-center gap-2"
                                    onClick={handleDelete}
                                    disabled={deleteChatMutation.isPending}
                                >
                                    {deleteChatMutation.isPending ? (
                                        <>
                                            <div className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        "Delete"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
