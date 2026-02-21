import { auth } from '@/lib/auth';
import { currentUser } from "@/modules/authentication/actions";
import { UserProvider } from "@/modules/authentication/components/user-provider";
import { Sidebar } from '@/modules/chat/components/sidebar';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

const ChatLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user) {
        return redirect('/login');
    }
    const user = await currentUser();

    const formattedUser = user ? {
        name: user.name ?? "user",
        email: user.email ?? "user@example.com",
        image: user.image ?? ""
    } : null;

    return (
        <UserProvider initialUser={formattedUser}>
            <div className="flex h-screen bg-white w-full overflow-hidden font-sans">
                <Sidebar />
                <main className="flex-1 flex flex-col min-w-0 z-10 overflow-hidden md:my-2 md:mr-2 border-t md:border border-gray-100/50 pt-14 md:pt-0 md:pb-6">
                    {children}
                </main>
            </div>
        </UserProvider>
    );
};

export default ChatLayout;