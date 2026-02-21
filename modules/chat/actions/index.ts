"use server"

import db from "@/lib/db";
import { MessageRole, MessageType } from "@/lib/generated/prisma/enums";
import { currentUser } from "@/modules/authentication/actions";
import { revalidatePath } from "next/cache";

export const createChatWithMessage = async (values: any) => {
    try {
        const user = await currentUser();
        if (!user) return { success: false, error: "Unauthorized" }

        const { content, model } = values;
        if (!content || !content.trim()) return { success: false, error: "Message is required" }

        const title = content.slice(0, 50) + (content.length > 50 ? "..." : "");

        const chat = await db.chat.create({
            data: {
                title,
                model,
                userId: user.id,
                messages: {
                    create: {
                        content,
                        messageRole: MessageRole.USER,
                        messageType: MessageType.NORMAL,
                        model
                    }
                }
            },
            include: {
                messages: true
            }
        })

        revalidatePath("/");

        return { success: true, data: chat, message: "Chat created successfully" }
    } catch (error) {
        console.log("Error in creating chat", error);
        return { success: false, error: "Failed to create chat" }
    }
}

export const getAllChats = async () => {
    try {
        const user = await currentUser();
        if (!user) return { success: false, error: "Unauthorized" }

        const chats = await db.chat.findMany({
            where: {
                userId: user.id
            },
            include: {
                messages: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return { success: true, data: chats, message: "Chats fetched successfully" }
    } catch (error) {
        console.log("Error in fetching chats", error);
        return { success: false, error: "Failed to fetch chats" }
    }
}

export const deleteChat = async (id: string) => {
    try {
        const user = await currentUser();
        if (!user) return { success: false, error: "Unauthorized" }

        const chat = await db.chat.delete({
            where: {
                id,
                userId: user.id
            }
        });

        revalidatePath("/");

        return { success: true, data: chat, message: "Chat deleted successfully" }
    } catch (error) {
        console.log("Error in deleting chat", error);
        return { success: false, error: "Failed to delete chat" }
    }
}

export const updateChatTitle = async (id: string, title: string) => {
    try {
        const user = await currentUser();
        if (!user) return { success: false, error: "Unauthorized" }

        const chat = await db.chat.update({
            where: {
                id,
                userId: user.id
            },
            data: {
                title
            }
        });

        revalidatePath("/");

        return { success: true, data: chat, message: "Chat renamed successfully" }
    } catch (error) {
        console.log("Error in renaming chat", error);
        return { success: false, error: "Failed to rename chat" }
    }
}