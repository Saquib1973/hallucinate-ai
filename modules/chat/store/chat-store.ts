import { create } from "zustand";
import { getAllChats } from "../actions";

interface ChatStore {
    activeChatId: string | null;
    setActiveChatId: (id: string) => void;
    chats: any[];
    messages: any[];
    loading: boolean;
    triggeredChats: Set<string>;
    loadChats: () => Promise<void>;
    addChat: (chat: any) => void;
    addMessage: (message: any) => void;
    clearMessages: () => void;
    hasChatBeenTriggered: (chatId: string) => boolean;
    markChatAsTriggered: (chatId: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
    activeChatId: null,
    setActiveChatId: (id: string) => set({ activeChatId: id }),
    chats: [],
    messages: [],
    triggeredChats: new Set(),
    loading: false,
    loadChats: async () => {
        set({ loading: true });
        const res = await getAllChats();
        if (res.success && res.data) {
            set({ chats: res.data, loading: false });
        } else {
            set({ loading: false });
        }
    },
    addChat: (chat: any) => set({ chats: [...get().chats, chat] }),
    addMessage: (message: any) => set({ messages: [...get().messages, message] }),
    clearMessages: () => set({ messages: [] }),
    hasChatBeenTriggered: (chatId: string) => {
        return get().triggeredChats.has(chatId)
    },
    markChatAsTriggered: (chatId: string) => {
        const triggered = new Set(get().triggeredChats);
        triggered.add(chatId);
        set({ triggeredChats: triggered })
    }
}))
