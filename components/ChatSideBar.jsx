"use client";
import { DrizzleChat } from "@/lib/schema";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { MessageCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";

const ChatSideBar = ({ chats, chatId, isPro }) => {
    const [loading, setLoading] = React.useState(false);

    return (
        <div className="w-full max-h-screen overflow-hidden border-r-2 border-gray-500 soff p-4 text-gray-200 bg-gray-900">
            <Link href="/">
                <Button className="w-full border-dashed border-white border">
                    <PlusCircle className="mr-2 w-4 h-4" />
                    New Chat
                </Button>
            </Link>

            <div className="flex max-h-screen overflow-hidden pb-20 flex-col gap-2 mt-4">
                {chats.map((chat) => (
                    <Link key={chat.id} href={`/chat/${chat.id}`}>
                        <div
                            className={cn("rounded-lg p-3 text-slate-300 flex items-center", {
                                "bg-blue-600 text-white": chat.id === chatId,
                                "hover:text-white": chat.id !== chatId,
                            })}
                        >
                            <MessageCircle className="mr-2" />
                            <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                                {chat.pdfName}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>


        </div>
    );
};

export default ChatSideBar;