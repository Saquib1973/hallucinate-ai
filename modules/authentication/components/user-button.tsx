"use client";

import { signOut } from "@/lib/auth-client";
import { useUser } from "@/modules/authentication/components/user-provider";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Crown, LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const UserButton = () => {
    const router = useRouter();
    const { user } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isLogoutStatus, setIsLogoutStatus] = useState<"logout" | "success" | "error" | null>(null);

    const handleSignOut = async () => {
        if (isLogoutStatus === "logout") return;

        try {
            setIsLogoutStatus("logout");

            await signOut({
                fetchOptions: {
                    onSuccess: () => {
                        setIsLogoutStatus("success");
                        router.push('/login');
                    }
                }
            });
        } catch (error) {
            setIsLogoutStatus("error");
            console.error("Error in Logout", error);
        } finally {
            setTimeout(() => setIsLogoutStatus(null), 3000);
        }
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getLogoutText = () => {
        switch (isLogoutStatus) {
            case "logout":
                return "Logging out...";
            case "success":
                return "Logged out!";
            case "error":
                return "Try again";
            default:
                return "Logout";
        }
    };

    if (!isMounted || !user) return null;

    const initials = user.name ? user.name.charAt(0).toUpperCase() : "U";

    return (
        <div className="relative mt-auto w-full" ref={dropdownRef}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute bottom-full right-0 mb-3 w-[70%] border-gray-100 rounded-2xl p-1 z-50 overflow-hidden origin-bottom bg-white shadow-sm border"
                    >
                        <div className="flex flex-col gap-1">
                            <div className="flex px-2 py-1.5 text-sm items-center gap-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition cursor-pointer">
                                <Crown className="size-4  text-orange-500" />
                                <span>Plans</span>
                            </div>
                            <div className="flex px-2 py-1.5 text-sm items-center gap-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition cursor-pointer">
                                <User className="size-4 " />
                                <span>Profile</span>
                            </div>
                            <div className="flex px-2 py-1.5 text-sm items-center gap-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition cursor-pointer">
                                <Settings className="size-4 " />
                                <span>Settings</span>
                            </div>
                            <div
                                onClick={handleSignOut}
                                className="cursor-pointer flex px-3 py-1.5 text-sm items-center gap-3 text-red-500 hover:bg-red-50 rounded-lg transition mt-1"
                            >
                                <LogOut className="size-4 " />
                                <span>{getLogoutText()}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-3 px-3 py-3 rounded-2xl cursor-pointer hover:bg-gray-100 transition ${isOpen ? 'bg-gray-100' : ''}`}
            >
                <div className="w-10 h-10 rounded-full bg-pink-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-pink-700 font-bold border-[1.5px] border-pink-300">
                    {user.image ? (
                        <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
                    ) : (
                        <span>{initials}</span>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name || "User"}</p>
                    <p className="text-xs text-gray-500 truncate">Free Plan</p>
                </div>
                <ChevronDown className={`size-4  text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
        </div>
    );
};