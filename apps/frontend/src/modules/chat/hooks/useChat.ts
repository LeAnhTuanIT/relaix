'use client';

import { useCallback, useEffect, useState } from 'react';
import { chatApi, type Message } from '@/shared/api/chat.api';

export function useChat() {
  const [conversations, setConversations] = useState<{ _id: string; title: string }[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  useEffect(() => {
    chatApi.getConversations().then(setConversations).catch(console.error);
  }, []);

  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }
    setLoadingMessages(true);
    chatApi
      .getMessages(activeId)
      .then(setMessages)
      .catch(console.error)
      .finally(() => setLoadingMessages(false));
  }, [activeId]);

  const handleCreate = useCallback(async () => {
    try {
      const conv = await chatApi.createConversation();
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
          const uploaded = await chatApi.uploadFile(pendingFile);
          fileUrl = uploaded.fileUrl;
          fileName = uploaded.fileName;
          setPendingFile(null);
        }
        const newMessages = await chatApi.sendMessage(activeId, content, fileUrl, fileName);
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
  const handleHomePageSend = useCallback(async (content: string, file?: File) => {
    setSending(true);
    try {
      const conv = await chatApi.createConversation(content.slice(0, 50));
      setConversations((prev) => [conv, ...prev]);
      setActiveId(conv._id);

      let fileUrl: string | undefined;
      let fileName: string | undefined;
      if (file) {
        const uploaded = await chatApi.uploadFile(file);
        fileUrl = uploaded.fileUrl;
        fileName = uploaded.fileName;
      }
      const newMessages = await chatApi.sendMessage(conv._id, content, fileUrl, fileName);
      setMessages(newMessages);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  }, []);

  return {
    conversations,
    activeId,
    setActiveId,
    messages,
    loadingMessages,
    sending,
    pendingFile,
    setPendingFile,
    handleCreate,
    handleSend,
    handleHomePageSend,
  };
}
