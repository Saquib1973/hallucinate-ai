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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-gray-500" />
                        Share Chat
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-6 py-4">
                    <div className="flex items-center justify-between border border-gray-100 rounded-lg p-4 bg-gray-50/50">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-sm font-medium text-gray-900">Make chat public</h3>
                            <p className="text-xs text-gray-500">
                                Anyone with the link will be able to view this chat.
                            </p>
                        </div>
                        <Switch
                            checked={isShared}
                            onCheckedChange={handleToggleShare}
                            disabled={isLoading}
                        />
                    </div>

                    {isShared && (
                        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="text-sm font-medium text-gray-700">Share Link</label>
                            <div className="flex space-x-2">
                                <Input
                                    value={shareUrl}
                                    readOnly
                                    className="flex-1 bg-gray-50 font-mono text-sm text-gray-600"
                                />
                                <Button
                                    type="button"
                                    className="px-3 py-1.5 text-xs"
                                    onClick={handleCopy}
                                >
                                    <span className="sr-only">Copy</span>
                                    {isCopied ? (
                                        <CheckIcon className="h-4 w-4" />
                                    ) : (
                                        <CopyIcon className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
