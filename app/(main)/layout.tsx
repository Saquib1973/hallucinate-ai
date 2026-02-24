import { auth } from '@/lib/auth';
import { currentUser } from "@/modules/authentication/actions";
import { UserProvider } from "@/modules/authentication/components/user-provider";
import { getAllChats } from '@/modules/chat/actions';
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

    const { data: chats } = await getAllChats();

    const formattedUser = user ? {
        name: user.name ?? "user",
        email: user.email ?? "user@example.com",
        image: user.image ?? ""
    } : null;

    return (
        <UserProvider initialUser={formattedUser}>
            <div className="flex h-dvh bg-white w-full overflow-hidden font-sans">
                <Sidebar chats={chats} />
                <main className="flex-1 flex flex-col z-10 overflow-hidden max-md:pt-14">
                    {children}
                </main>
            </div>
        </UserProvider>
    );
};

export default ChatLayout;