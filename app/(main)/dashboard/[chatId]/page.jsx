import ChatComponent from "@/components/ChatComponent";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import { db } from "@/lib/index";
import { chats } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

const ChatPage = async ({ params: { chatId } }) => {
    const { userId } = await auth();
    if (!userId) {
        return redirect("/sign-in");
    }
    // const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
    // const _chats = [
    //     {
    //         id: 1,
    //         pdfName: "Resume AI Overview.pdf",
    //         pdfUrl: "https://cdn.example.com/uploads/resume_ai.pdf",
    //         createdAt: new Date("2025-07-04T16:32:00Z"),
    //         userId: "user_abc123",
    //         fileKey: "resume_ai_2025.pdf"
    //     }];
    const isPro = true;
    if (!chats) {
        return redirect("/");
    }
    if (!chats.find((chat) => chat.id === parseInt(chatId))) {
        return redirect("/");
    }

    const currentChat = chats.find((chat) => chat.id === parseInt(chatId));

    return (
        <div className="flex h-screen">
            <div className="flex w-full h-screen overflow-hidden">
                {/* Chat Sidebar */}
                <div className="flex-[1] max-w-xs h-full overflow-y-auto border-r border-gray-200">
                    <ChatSideBar chats={chats} chatId={parseInt(chatId)} isPro={isPro} />
                </div>

                {/* PDF Viewer */}
                <div className="flex-[5] h-full bg-white p-4 overflow-y-auto">
                    <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
                </div>

                {/* Chat Component */}
                <div className="flex-[3] h-full overflow-y-auto border-l-4 border-l-slate-200">
                    <ChatComponent chatId={parseInt(chatId)} />
                </div>
            </div>
        </div>
    );
};

export default ChatPage;