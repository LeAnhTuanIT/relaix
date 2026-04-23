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

            <div className="pb-8 pt-4 w-full flex-shrink-0 relative z-40">
              <ChatInput
                onSend={handleSend}
                onFileSelect={setPendingFile}
                disabled={sending}
                pendingFile={pendingFile}
                onClearFile={() => setPendingFile(null)}
                appName="Ask template.net"
                isFirstMessage={messages.length === 0}
              />
            </div>
          </div>
        </>
      ) : (
        <HomePage
          onSend={handleHomePageSend}
          sending={sending}
        />
      )}
    </div>
  );
}
