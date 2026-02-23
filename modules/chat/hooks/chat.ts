import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createChatWithMessage, deleteChat, getChatById, updateChatTitle } from "../actions";
import { useChatStore } from "../store/chat-store";

export const useCreateChat = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (values: { model: string; content: string }) => createChatWithMessage(values),
        onSuccess: (result) => {
            if (result.success && result.data) {
                queryClient.invalidateQueries({ queryKey: ['chats'] })
                useChatStore.getState().loadChats();
                router.push(`/chat/${result.data?.id}?autoTrigger=true`)
            }
        },
        onError: (error) => {
            console.error("Create Chat ", error);
        }
    })

}

export const useDeleteChat = (chatId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => deleteChat(chatId),
        onSuccess: (result) => {
            if (result.success && result.data) {
                queryClient.invalidateQueries({ queryKey: ['chats'] })
                useChatStore.getState().loadChats();
            }
        },
        onError: (error) => {
            console.error("Delete Chat ", error);
        }
    })
}

export const useUpdateChatTitle = (chatId: string, title: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => updateChatTitle(chatId, title),
        onSuccess: (result) => {
            if (result.success && result.data) {
                queryClient.invalidateQueries({ queryKey: ['chats'] })
                useChatStore.getState().loadChats();
            }
        },
        onError: (error) => {
            console.error("Update Chat ", error);
        }
    })
}

export const useGetChatById = (chatId: string) => {

    return useQuery({
        queryKey: ['chats', chatId],
        queryFn: () => getChatById(chatId),
    })
} 
