'use client';

import { useCallback, useEffect, useState } from 'react';
import { Sidebar } from '@/components/chat/Sidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { ChatInput } from '@/components/chat/ChatInput';
import { HomePage } from '@/components/chat/HomePage';
import { api, type Message } from '@/lib/api';
import { ArrowLeft, Plus } from 'lucide-react';

const APP_NAME = 'AI Chat';

export default function ChatPage() {
  const [, setConversations] = useState<{ _id: string; title: string }[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  useEffect(() => {
    api.getConversations().then(setConversations).catch(console.error);
  }, []);

  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }
    setLoadingMessages(true);
    api
      .getMessages(activeId)
      .then(setMessages)
      .catch(console.error)
      .finally(() => setLoadingMessages(false));
  }, [activeId]);

  const handleCreate = useCallback(async () => {
    try {
      const conv = await api.createConversation();
      setConversations((prev) => [conv, ...prev]);
      setActiveId(conv._id);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleSend = useCallback(
    async (content: string) => {
      if (!activeId) return;
      setSending(true);
      let fileUrl: string | undefined;
      let fileName: string | undefined;
      try {
        if (pendingFile) {
          const uploaded = await api.uploadFile(pendingFile);
          fileUrl = uploaded.fileUrl;
          fileName = uploaded.fileName;
          setPendingFile(null);
        }
        const newMessages = await api.sendMessage(activeId, content, fileUrl, fileName);
        setMessages((prev) => [...prev, ...newMessages]);
        setConversations((prev) =>
          prev.map((c) =>
            c._id === activeId
              ? { ...c, title: newMessages[0]?.content?.slice(0, 50) || c.title }
              : c,
          ),
        );
      } catch (err) {
        console.error(err);
      } finally {
        setSending(false);
      }
    },
    [activeId, pendingFile],
  );

  // Start a brand-new conversation then send the first message
  const handleHomePageSend = useCallback(
    async (content: string, file?: File) => {
      setSending(true);
      try {
        const conv = await api.createConversation(content.slice(0, 50));
        setConversations((prev) => [conv, ...prev]);
        setActiveId(conv._id);

        let fileUrl: string | undefined;
        let fileName: string | undefined;
        if (file) {
          const uploaded = await api.uploadFile(file);
          fileUrl = uploaded.fileUrl;
          fileName = uploaded.fileName;
        }
        const newMessages = await api.sendMessage(conv._id, content, fileUrl, fileName);
        setMessages(newMessages);
      } catch (err) {
        console.error(err);
      } finally {
        setSending(false);
      }
    },
    [],
  );

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

            <ChatWindow messages={messages} loading={loadingMessages} sending={sending} />

            <div className="px-4 pb-6 pt-2 max-w-2xl mx-auto w-full flex-shrink-0">
              <ChatInput
                onSend={handleSend}
                onFileSelect={setPendingFile}
                disabled={sending}
                pendingFile={pendingFile}
                onClearFile={() => setPendingFile(null)}
                appName={APP_NAME}
              />
            </div>
          </>
        ) : (
          <HomePage onSend={handleHomePageSend} sending={sending} />
        )}
      </main>
    </div>
  );
}
