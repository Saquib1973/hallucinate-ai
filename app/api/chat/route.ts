import db from "@/lib/db";
import { MessageRole, MessageType } from "@/lib/generated/prisma/enums";
import { CHAT_SYSTEM_PROMPT } from "@/prompt";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { NextResponse } from "next/server";

const provider = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY
})

const extractPartsAsJSON = (message: any) => {
    if (message.parts && Array.isArray(message.parts)) {
        return JSON.stringify(message.parts)
    }
    const content = message.content || "";
    return JSON.stringify([{ type: "text", text: content }]);
}

export async function POST(req: Request) {
    try {
        const { chatId, model, skipUserMessage, messages } = await req.json();

        const allMessages = messages || [];

        let modelMessages = allMessages.map((msg: any) => ({
            role: msg.role,
            content: msg.parts ? msg.parts
                .filter((part: any) => part.type === "text")
                .map((part: any) => part.text)
                .join("\n") : msg.content
        })).filter((m: any) => m.content);

        const result = streamText({
            model: provider.chat(model),
            messages: modelMessages,
            system: CHAT_SYSTEM_PROMPT,
        })

        return result.toUIMessageStreamResponse({
            sendReasoning: true,
            originalMessages: allMessages,
            onFinish: async ({ responseMessage }) => {
                if (!chatId) return;

                const messagesToSave: any[] = [];

                if (!skipUserMessage) {
                    const latestUserMessage = allMessages[allMessages.length - 1];
                    if (latestUserMessage?.role === "user") {
                        const userPartsJSON = extractPartsAsJSON(latestUserMessage);
                        messagesToSave.push({
                            chatId,
                            content: userPartsJSON,
                            messageRole: MessageRole.USER,
                            messageType: MessageType.NORMAL
                        });
                    }
                }
                if (responseMessage?.parts && responseMessage.parts.length > 0) {
                    const assistantParts = extractPartsAsJSON(responseMessage);
                    messagesToSave.push({
                        chatId,
                        content: assistantParts,
                        messageRole: MessageRole.ASSISTANT,
                        messageType: MessageType.NORMAL
                    });
                }

                if (messagesToSave.length > 0) {
                    await db.message.createMany({
                        data: messagesToSave
                    });
                }
            }
        })

    } catch (error) {
        console.log("Error in stream text", error);
        return NextResponse.json({ error: "Error in stream text" }, { status: 500 });

    }
}