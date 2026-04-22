'use client';

import { Sidebar } from '@/shared/components/layout/Sidebar';
import { ChatWindow } from '@/modules/chat/components/ChatWindow';
import { ChatInput } from '@/modules/chat/components/ChatInput';
import { HomePage } from '@/modules/home/components/HomePage';
import { useChat } from '@/modules/chat/hooks/useChat';
import { ArrowLeft, Search, X, Sparkles } from 'lucide-react';

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
    <div className="flex h-screen w-full bg-white overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 relative flex flex-col min-w-0 overflow-hidden">
        {/* Persistent Top Navbar like the image */}
        <header className="flex items-center justify-between px-10 py-5 flex-shrink-0 bg-white/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-1">
            <span className="font-black text-blue-600 text-xl tracking-tighter cursor-pointer" onClick={() => setActiveId(null)}>TEMPLATE</span>
            <span className="font-medium text-gray-400 text-xl tracking-tighter cursor-pointer" onClick={() => setActiveId(null)}>.NET</span>
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
                  appName="Ask template.net"
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                />
              </div>

              {/* Promo Card at bottom right */}
              <div className="fixed bottom-8 right-8 w-[320px] bg-blue-600 rounded-[32px] p-6 shadow-2xl z-50 animate-in fade-in slide-in-from-right-4">
                <button className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors">
                  <X size={18} />
                </button>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={20} className="text-yellow-300" fill="currentColor" />
                  <p className="text-white font-black text-lg tracking-tight">Top 50 AI Models.</p>
                </div>
                <p className="text-white/90 text-sm font-bold mb-1">1M+ Premium Templates.</p>
                <p className="text-white/80 text-xs font-medium mb-6">One Pro Editor. No Watermark</p>
                <button className="w-full bg-[#ff4d29] text-white py-3 rounded-2xl font-black text-sm shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Limited time - 50% OFF
                </button>
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
