import { create } from "zustand"
import { getAllChats } from "../actions"

interface ChatStore {
    activeChatId: string | null;
    setActiveChatId: (id: string) => void;
    chats: any[];
    loading: boolean;
    loadChats: () => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
    activeChatId: null,
    setActiveChatId: (id: string) => set({ activeChatId: id }),
    chats: [],
    loading: false,
    loadChats: async () => {
        set({ loading: true });
        const res = await getAllChats();
        if (res.success && res.data) {
            set({ chats: res.data, loading: false });
        } else {
            set({ loading: false });
        }
    }
}))
