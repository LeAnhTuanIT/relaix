"use client";

import { ChatWindow } from "@/modules/chat/components/ChatWindow";
import { ChatInput } from "@/modules/chat/components/ChatInput";
import { HomePage } from "@/modules/home/components/HomePage";
import { useChat } from "@/modules/chat/providers/chat-provider";

export default function ChatPage() {
  const {
    activeId,
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
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {activeId ? (
        <>
          <div className="flex-1 flex flex-col overflow-hidden relative">
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
                menuDirection="up"
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
    </div>
  );
}
