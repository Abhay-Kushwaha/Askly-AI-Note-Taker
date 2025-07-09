import { db } from "@/lib/index";
import { messages } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export const POST = async (req) => {
    const { chatId } = await req.json();
    const _messages = await db
        .select()
        .from(messages)
        .where(eq(messages.chatId, chatId));
    return NextResponse.json(_messages);
};