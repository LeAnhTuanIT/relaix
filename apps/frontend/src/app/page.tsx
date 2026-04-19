'use client';

import { useCallback, useEffect, useState } from 'react';
import { ConversationList } from '@/components/chat/ConversationList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { ChatInput } from '@/components/chat/ChatInput';
import { api, type Conversation, type Message } from '@/lib/api';

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
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

  const handleDelete = useCallback(
    async (id: string) => {
      await api.deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c._id !== id));
      if (activeId === id) {
        setActiveId(null);
        setMessages([]);
      }
    },
    [activeId],
  );

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

  return (
    <div className="flex h-screen bg-white">
      <ConversationList
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        onCreate={handleCreate}
        onDelete={handleDelete}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {activeId ? (
          <>
            <header className="border-b border-gray-200 px-6 py-3 flex items-center">
              <h1 className="font-semibold text-gray-800 text-sm truncate">
                {conversations.find((c) => c._id === activeId)?.title || 'Conversation'}
              </h1>
            </header>

            <ChatWindow messages={messages} loading={loadingMessages} sending={sending} />

            <ChatInput
              onSend={handleSend}
              onFileSelect={setPendingFile}
              disabled={sending}
              pendingFile={pendingFile}
              onClearFile={() => setPendingFile(null)}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
            <div className="text-6xl">💬</div>
            <p className="text-lg font-medium text-gray-500">AI Chat</p>
            <p className="text-sm">Chọn cuộc trò chuyện hoặc tạo mới để bắt đầu</p>
            <button
              onClick={handleCreate}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              + New Conversation
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
