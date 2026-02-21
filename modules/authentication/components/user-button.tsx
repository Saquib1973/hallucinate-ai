"use client";

import { signOut } from "@/lib/auth-client";
import { useUser } from "@/modules/authentication/components/user-provider";
import { ChevronDown, Crown, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
export const UserButton = () => {
    const router = useRouter();
    const { user } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isLogoutLoading, setIsLogoutLoading] = useState(false);

    const handleSignOut = () => {
        try {
            setIsLogoutLoading(true);
            onSignOut();
        } catch (error) {
            console.log("Error in Logout", error);
        } finally {
            setIsLogoutLoading(false);
        }

    }
    const onSignOut = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push('/login');
                }
            }
        });
    }

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

    if (!isMounted || !user) return null;

    const initials = user.name ? user.name.charAt(0).toUpperCase() : "U";

    return (
        <div className="relative mt-auto w-full" ref={dropdownRef}>
            {isOpen && (
                <div className="absolute bottom-full left-0 mb-3 w-full border-gray-100 rounded-3xl p-2 z-50 overflow-hidden transform transition-all duration-200 origin-bottom bg-white shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] border">
                    <div className="px-3 py-3 border-b border-gray-100 mb-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name || "User"}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="flex px-3 py-2.5 text-sm items-center gap-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl transition cursor-pointer">
                            <Crown className="w-4 h-4 text-orange-500" />
                            <span>Plans</span>
                        </div>
                        <div className="flex px-3 py-2.5 text-sm items-center gap-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl transition cursor-pointer">
                            <Settings className="w-4 h-4 text-gray-500" />
                            <span>Settings</span>
                        </div>
                        <div onClick={handleSignOut} className="cursor-pointer flex px-3 py-2.5 text-sm items-center gap-3 text-red-500 hover:bg-red-50 rounded-xl transition mt-1">
                            <LogOut className="w-4 h-4" />
                            <span>{isLogoutLoading ? "Logging out..." : "Logout"}</span>
                        </div>
                    </div>
                </div>
            )}

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
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
        </div>
    );
};
