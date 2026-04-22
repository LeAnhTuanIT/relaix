'use client';

import { Sidebar } from '@/shared/components/layout/Sidebar';
import { ChatWindow } from '@/modules/chat/components/ChatWindow';
import { ChatInput } from '@/modules/chat/components/ChatInput';
import { HomePage } from '@/modules/home/components/HomePage';
import { useChat } from '@/modules/chat/hooks/useChat';
import { ArrowLeft, Plus } from 'lucide-react';

const APP_NAME = 'AI Chat';

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
    handleCreate,
    handleSend,
    handleHomePageSend,
    selectedModel,
    setSelectedModel,
  } = useChat();

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeId ? (
          <>
            <header className="flex items-center gap-3 px-6 py-3 border-b border-gray-100 flex-shrink-0">
              <button
                onClick={() => setActiveId(null)}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <div className="flex-1" />
              <button
                onClick={handleCreate}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors"
              >
                <Plus size={14} />
                New
              </button>
            </header>
            <ChatWindow
              messages={messages}
              loading={loadingMessages}
              sending={sending}
              streamingText={streamingText}
            />
            <div className="px-4 pb-6 pt-2 max-w-2xl mx-auto w-full flex-shrink-0">
              <ChatInput
                onSend={handleSend}
                onFileSelect={setPendingFile}
                disabled={sending}
                pendingFile={pendingFile}
                onClearFile={() => setPendingFile(null)}
                appName={APP_NAME}
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
              />
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
