"use client";

import { Sidebar } from "@/shared/components/layout/Sidebar";
import { ChatWindow } from "@/modules/chat/components/ChatWindow";
import { ChatInput } from "@/modules/chat/components/ChatInput";
import { HomePage } from "@/modules/home/components/HomePage";
import { useChat } from "@/modules/chat/hooks/useChat";
import { ArrowLeft, Search } from "lucide-react";

export default function ChatPage() {
  const {
    activeId,
    setActiveId,
    messages,
    loadingMessages,
    sending,
    streamingText,
    pendingFile,
    setPendingFile,
    handleSend,
    handleHomePageSend,
    selectedModel,
    setSelectedModel,
  } = useChat();

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 relative flex flex-col min-w-0 overflow-hidden">
        {/* Persistent Top Navbar like the image */}
        <header className="flex items-center justify-between px-10 py-5 flex-shrink-0 bg-white/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-1">
            <span
              className="font-black text-blue-600 text-xl tracking-tighter cursor-pointer"
              onClick={() => setActiveId(null)}
            >
              TEMPLATE
            </span>
            <span
              className="font-medium text-gray-400 text-xl tracking-tighter cursor-pointer"
              onClick={() => setActiveId(null)}
            >
              .NET
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-gray-500 hover:text-gray-800 transition-colors">
              <Search size={22} />
            </button>
            <button className="text-[15px] text-gray-600 hover:text-gray-900 font-bold transition-colors">
              Pricing
            </button>
            <button className="text-[15px] font-bold text-gray-800 border border-gray-200 rounded-xl px-5 py-2 hover:bg-gray-50 transition-colors shadow-sm">
              Sign up
            </button>
          </div>
        </header>

        {activeId ? (
          <>
            <div className="flex-1 flex flex-col overflow-hidden relative">
              {/* Back Button specific to Chat Detail */}
              <div className="px-10 py-2">
                <button
                  onClick={() => setActiveId(null)}
                  className="flex items-center gap-2 text-[15px] font-bold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  <ArrowLeft size={18} strokeWidth={3} />
                  Back
                </button>
              </div>

              <ChatWindow
                messages={messages}
                loading={loadingMessages}
                sending={sending}
                streamingText={streamingText}
              />

              <div className="px-4 pb-8 pt-2 max-w-3xl mx-auto w-full flex-shrink-0 relative z-40">
                <ChatInput
                  onSend={handleSend}
                  onFileSelect={setPendingFile}
                  disabled={sending}
                  pendingFile={pendingFile}
                  onClearFile={() => setPendingFile(null)}
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                />
              </div>
            </div>
          </>
        ) : (
          <HomePage
            onSend={handleHomePageSend}
            sending={sending}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        )}
      </main>
    </div>
  );
}
