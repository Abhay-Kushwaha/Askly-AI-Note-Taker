"use client"

import React from "react"
import { useState } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { MessageCircle, Send, Plus, Trash2 } from "lucide-react"

// Mock chat data with more realistic titles
const initialChats = [
  { id: 1, title: "Project Planning Notes", messages: [] },
  { id: 2, title: "Meeting Summary", messages: [] },
  { id: 3, title: "Research Questions", messages: [] },
  { id: 4, title: "Brainstorm Session", messages: [] },
]

export default function ChatPage() {
  const [chats, setChats] = useState(initialChats)
  const [selectedChatId, setSelectedChatId] = useState(null)
  const [chatTitle, setChatTitle] = useState("")

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    onFinish: (message) => {
      // Save the conversation to the selected chat
      if (selectedChatId) {
        setChats((prev) =>
          prev.map((chat) => (chat.id === selectedChatId ? { ...chat, messages: [...messages, message] } : chat))
        )
      }
    },
  })

  const createNewChat = () => {
    const newId = Math.max(...chats.map((c) => c.id)) + 1
    const newChat = {
      id: newId,
      title: `New Chat ${newId}`,
      messages: [],
    }
    setChats((prev) => [...prev, newChat])
    setSelectedChatId(newId)
    setMessages([])
    setChatTitle(newChat.title)
  }

  const selectChat = (chatId) => {
    const chat = chats.find((c) => c.id === chatId)
    if (chat) {
      setSelectedChatId(chatId)
      setMessages(chat.messages)
      setChatTitle(chat.title)
    }
  }

  const deleteChat = (chatId, e) => {
    e.stopPropagation()
    setChats((prev) => prev.filter((c) => c.id !== chatId))
    if (selectedChatId === chatId) {
      setSelectedChatId(null)
      setMessages([])
      setChatTitle("")
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (!selectedChatId) {
      createNewChat()
    }
    handleSubmit(e)
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Sidebar */}
      <aside className="relative z-10 w-80 min-h-screen bg-black/40 backdrop-blur-sm border-r border-white/10">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Chat History</h2>
            <Button
              onClick={createNewChat}
              size="sm"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-120px)]">
            <div className="space-y-2">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                    selectedChatId === chat.id
                      ? "bg-white/20 text-white font-medium"
                      : "hover:bg-white/10 text-white/80"
                  }`}
                  onClick={() => selectChat(chat.id)}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <MessageCircle className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate text-sm">{chat.title}</span>
                  </div>
                  <Button
                    onClick={(e) => deleteChat(chat.id, e)}
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto text-white/60 hover:text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col">
        {!selectedChatId && messages.length === 0 ? (
          // Welcome screen
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-md border-white/20 p-10 text-center">
              <h1 className="text-5xl font-bold text-white mb-6">Askly AI Note Taker</h1>
              <p className="text-xl text-white/90 mb-8">Ask anything, get instant AI-powered answers and notes.</p>
              <Button onClick={createNewChat} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                Start New Chat
              </Button>
            </Card>
          </div>
        ) : (
          // Chat interface
          <div className="flex-1 flex flex-col">
            {/* Chat header */}
            <div className="p-6 border-b border-white/10 bg-black/20 backdrop-blur-sm">
              <h1 className="text-2xl font-semibold text-white">{chatTitle || "New Chat"}</h1>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6 max-w-4xl mx-auto">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-white/10 backdrop-blur-sm text-white border border-white/20"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 backdrop-blur-sm text-white border border-white/20 p-4 rounded-2xl">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-sm text-white/80">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Input area - always visible */}
        <div className="p-6 bg-black/20 backdrop-blur-sm border-t border-white/10">
          <form onSubmit={onSubmit} className="max-w-4xl mx-auto">
            <div className="flex space-x-4">
              <Textarea
                value={input}
                onChange={handleInputChange}
                placeholder="Type your question here..."
                className="flex-1 min-h-[60px] bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 focus:border-blue-400 focus:ring-blue-400/20 resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    onSubmit(e)
                  }
                }}
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 self-end"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}