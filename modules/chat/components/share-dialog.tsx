"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/custom/button";
import { Input } from "@/components/custom/input";
import { CopyIcon, CheckIcon, Globe } from "lucide-react";
import { toggleShareChat } from "../actions";
import { Switch } from "@/components/ui/switch";

interface ShareDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    chatId: string;
    isSharedInitial: boolean;
}

export const ShareDialog = ({ open, onOpenChange, chatId, isSharedInitial }: ShareDialogProps) => {
    const [isShared, setIsShared] = useState(isSharedInitial || false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/share/${chatId}` : '';

    const handleToggleShare = async () => {
        setIsLoading(true);
        const newSharedState = !isShared;
        try {
            const res = await toggleShareChat(chatId, newSharedState);
            if (res.success) {
                setIsShared(newSharedState);
                // Optional: alert can be added here, but visual switch change is enough feedback
            } else {
                alert(res.error || "Something went wrong");
            }
        } catch (error) {
            alert("Failed to update share settings");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (!shareUrl) return;
        navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0 border-gray-200/60 shadow-2xl rounded-2xl">
                <div className="px-6 py-6 pb-5">
                    <DialogHeader>
                        <DialogTitle className="text-[17px] font-semibold text-gray-900 tracking-tight">Share connection</DialogTitle>
                    </DialogHeader>
                    <p className="text-[14px] text-gray-500 mt-2 leading-relaxed pr-4">
                        Anyone with the link will be able to view this chat. They will not be able to send messages or see your other chats.
                    </p>
                </div>

                <div className="bg-gray-50/50 px-6 py-5 border-t border-gray-100 flex flex-col gap-5">
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex flex-col items-center justify-center shrink-0 border border-blue-100/50">
                                <Globe className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-[14px] font-medium text-gray-900">Public Link</h3>
                                <p className="text-[13px] text-gray-500">
                                    {isShared ? "Link is active and ready" : "Link is currently disabled"}
                                </p>
                            </div>
                        </div>
                        <Switch
                            checked={isShared}
                            onCheckedChange={handleToggleShare}
                            disabled={isLoading}
                            className="data-[state=checked]:bg-blue-600"
                        />
                    </div>

                    {isShared && (
                        <div className="w-full animate-in fade-in slide-in-from-top-1 duration-200">
                            <div className="flex group relative w-full items-center">
                                <Input
                                    value={shareUrl}
                                    readOnly
                                    className="flex-1 pr-12 bg-white font-mono text-[13px] text-gray-600 border-gray-200 h-10 select-all focus-visible:ring-blue-500 focus-visible:border-blue-500 shadow-sm"
                                    onClick={(e) => (e.target as HTMLInputElement).select()}
                                />
                                <button
                                    type="button"
                                    className="absolute right-1 w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                    onClick={handleCopy}
                                >
                                    <span className="sr-only">Copy</span>
                                    {isCopied ? (
                                        <CheckIcon className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <CopyIcon className="h-3.5 w-3.5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
