"use client";

import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Check, MoreHorizontal, Pencil, Share, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDeleteChat, useRenameChatTitle } from '../hooks/chat';
import { useChatStore } from '../store/chat-store';
import { ShareDialog } from './share-dialog';

export const RecentChats = ({ initialChats }: { initialChats?: any }) => {
    const { chats, loading } = useChatStore();
    const updateChatTitleMutation = useRenameChatTitle();
    const deleteChatMutation = useDeleteChat();
    const pathname = usePathname();
    const router = useRouter();

    const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState("");
    const [chatToDelete, setChatToDelete] = useState<any | null>(null);
    const [chatToShare, setChatToShare] = useState<any | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);



    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.chat-options-dropdown') && !target.closest('.chat-options-trigger')) {
                setOpenMenuId(null);
            }
        };

        if (openMenuId) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openMenuId]);

    const handleDelete = () => {
        if (!chatToDelete) return;
        deleteChatMutation.mutate({ chatId: chatToDelete.id }, {
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
        updateChatTitleMutation.mutate({ chatId: renamingChatId || "", title: renameValue.trim() }, {
            onSuccess: () => {
                setRenamingChatId(null);
            }
        });
    };

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

                        console.log(renamingChatId, chat.id)
                        return (
                            <div key={chat.id} className={`group relative`}>
                                {isRenaming ? (
                                    <form onSubmit={handleRenameSubmit} className="flex flex-center items-center gap-1 p-2 bg-gray-100 rounded-xl text-sm w-full">
                                        <input
                                            type="text"
                                            autoFocus
                                            value={renameValue}
                                            onChange={(e) => setRenameValue(e.target.value)}
                                            className="flex-1 mr-2 min-w-0 outline-none bg-transparent"
                                            onBlur={() => {
                                                setTimeout(() => setRenamingChatId(null), 150);
                                            }}
                                            disabled={updateChatTitleMutation.isPending}
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setRenamingChatId(null);
                                            }}
                                            className="bg-red-100 rounded-full p-0.5 text-red-500 cursor-pointer transition flex-shrink-0"
                                            disabled={updateChatTitleMutation.isPending}
                                        >
                                            <X className="size-3.5" />
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-green-100 rounded-full p-0.5 text-green-500 cursor-pointer transition flex-shrink-0"
                                            disabled={updateChatTitleMutation.isPending}
                                        >
                                            <Check className="size-3.5" />
                                        </button>
                                    </form>
                                ) : (
                                    <>
                                        <Link href={`/chat/${chat.id}`} className={`flex items-center justify-between p-2 text-sm text-gray-600 rounded-xl transition group-hover:bg-gray-100 ${isActive ? 'text-black font-medium' : ''} ${openMenuId === chat.id || renamingChatId === chat.id ? "bg-gray-100" : ""}`}>
                                            <span className="truncate pr-6">{chat.title || "New Chat"}</span>
                                        </Link>
                                        <div className={`absolute right-2 top-1/2 -translate-y-1/2 items-center gap-1 pl-6 flex ${openMenuId === chat.id ? 'flex md:flex' : 'flex md:hidden md:group-hover:flex'}`}>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setOpenMenuId(openMenuId === chat.id ? null : chat.id);
                                                }}
                                                className="chat-options-trigger p-0.5 cursor-pointer transition bg-gray-50 rounded-full"
                                            >
                                                <MoreHorizontal className="size-4" />
                                            </button>
                                        </div>

                                        <AnimatePresence>
                                            {openMenuId === chat.id && (
                                                <>
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                        transition={{ duration: 0.15, ease: "easeOut" }}
                                                        className="absolute right-1 top-9 bg-white rounded-xl border border-gray-100 p-1 z-[70] flex flex-col gap-1 min-w-[124px]"
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            className="w-full p-1 px-3 rounded-lg justify-start text-sm hover:bg-gray-100"
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
                                                            className="w-full p-1 px-3 rounded-lg justify-start text-sm"
                                                            onClick={(e: React.MouseEvent) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                setOpenMenuId(null);
                                                                setChatToShare(chat);
                                                            }}
                                                        >
                                                            <Share className="size-3.5 mr-2" /> Share
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            className="w-full p-1 px-3 rounded-lg justify-start text-sm hover:bg-red-50 hover:text-red-700"
                                                            onClick={(e: React.MouseEvent) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                setOpenMenuId(null);
                                                                setChatToDelete(chat);
                                                            }}
                                                        >
                                                            <Trash2 className="size-3.5 mr-2" /> Delete
                                                        </Button>
                                                    </motion.div>
                                                </>
                                            )}
                                        </AnimatePresence>
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

            {/* Delete Confirmation Modal */}
            {mounted && createPortal(
                <AnimatePresence>
                    {chatToDelete && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4 backdrop-blur-sm"
                            onMouseDown={() => setChatToDelete(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                                transition={{ type: "spring", duration: 0.3 }}
                                className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Chat</h3>
                                    <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                        Are you sure you want to delete <span className="font-medium text-gray-800">"{chatToDelete.title || "New Chat"}"</span>?
                                        <br />
                                        This action cannot be undone.
                                    </p>
                                    <div className="flex justify-end gap-3 mt-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setChatToDelete(null)}
                                            disabled={deleteChatMutation.isPending}
                                            className="h-10 px-4"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            className="h-10 px-4 !bg-red-600 hover:!bg-red-700 text-white border-none flex items-center gap-2"
                                            onClick={handleDelete}
                                            disabled={deleteChatMutation.isPending}
                                        >
                                            {deleteChatMutation.isPending ? (
                                                <>
                                                    <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Deleting...
                                                </>
                                            ) : (
                                                "Delete"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {chatToShare && (
                <ShareDialog
                    open={!!chatToShare}
                    onOpenChange={(open) => !open && setChatToShare(null)}
                    chatId={chatToShare.id}
                    isSharedInitial={chatToShare.isShared}
                />
            )}
        </>
    );
};