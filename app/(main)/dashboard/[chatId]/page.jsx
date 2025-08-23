// app/(main)/dashboard/[chatId]/page.jsx
import ChatComponent from "@/components/ChatComponent";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import { db } from "@/lib/index";
import { chats } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getS3Url } from "@/lib/s3";

const ChatPage = async ({ params: { chatId } }) => {
    const { userId } = await auth();
    if (!userId) {
        return redirect("/sign-in");
    }

    const userChats = await db.select().from(chats).where(eq(chats.userId, userId));
    if (!userChats || !userChats.length) {
        return redirect("/");
    }

    const currentChat = userChats.find((chat) => chat.id === parseInt(chatId));
    if (!currentChat) {
        return redirect("/");
    }

    // Get signed URL for PDF
    const pdfUrl = getS3Url(currentChat.fileKey);

    return (
        <div className="flex h-screen">
            <div className="flex w-full h-screen overflow-hidden">
                {/* Chat Sidebar */}
                <div className="flex-[1] max-w-xs h-full overflow-y-auto border-r border-gray-200">
                    <ChatSideBar chats={userChats} chatId={parseInt(chatId)} />
                </div>

                {/* PDF Viewer */}
                <div className="flex-[5] h-full bg-white p-4 overflow-y-auto">
                    <PDFViewer pdf_url={pdfUrl} />
                </div>

                {/* Chat Component */}
                <div className="flex-[3] h-full overflow-y-auto border-l-4 border-l-slate-200">
                    <ChatComponent chatId={parseInt(chatId)} fileKey={currentChat.fileKey} />
                </div>
            </div>
        </div>
    );
};

export default ChatPage;