'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatApi, type Conversation, type Message } from '@/shared/api/chat.api';

interface ChatContextType {
  conversations: Conversation[];
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  messages: Message[];
  loadingMessages: boolean;
  sending: boolean;
  streamingText: string;
  pendingFile: File | null;
  setPendingFile: (file: File | null) => void;
  handleCreate: () => Promise<void>;
  handleSend: (content: string) => Promise<void>;
  handleHomePageSend: (content: string, file?: File) => Promise<void>;
  handleDelete: (id: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [streamingText, setStreamingText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedModel, setSelectedModel] = useState('claude-sonnet-4.6');

  // ── Conversations ──────────────────────────────────────────────
  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: chatApi.getConversations,
  });

  const createMutation = useMutation({
    mutationFn: (title?: string) => chatApi.createConversation(title),
    onSuccess: (conv) => {
      queryClient.setQueryData<Conversation[]>(['conversations'], (prev = []) => [conv, ...prev]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => chatApi.deleteConversation(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Conversation[]>(['conversations'], (prev = []) =>
        prev.filter((c) => c._id !== id),
      );
      if (activeId === id) setActiveId(null);
    },
  });

  // ── Messages ───────────────────────────────────────────────────
  const { data: messages = [], isLoading: loadingMessages } = useQuery<Message[]>({
    queryKey: ['messages', activeId],
    queryFn: () => chatApi.getMessages(activeId!),
    enabled: !!activeId,
  });

  // ── Handlers ───────────────────────────────────────────────────
  const handleCreate = useCallback(async () => {
    const conv = await createMutation.mutateAsync(undefined);
    setActiveId(conv._id);
  }, [createMutation]);

  const handleSend = useCallback(
    async (content: string) => {
      if (!activeId || isSending) return;
      setIsSending(true);
      setStreamingText('');

      try {
        let fileUrl: string | undefined;
        let fileName: string | undefined;
        if (pendingFile) {
          const uploaded = await chatApi.uploadFile(pendingFile);
          fileUrl = uploaded.fileUrl;
          fileName = uploaded.fileName;
          setPendingFile(null);
        }

        const tempId = `temp-${Date.now()}`;
        const optimisticUser: Message = {
          _id: tempId,
          conversationId: activeId,
          role: 'user',
          content,
          fileUrl,
          fileName,
          createdAt: new Date().toISOString(),
        };
        queryClient.setQueryData<Message[]>(['messages', activeId], (prev = []) => [
          ...prev,
          optimisticUser,
        ]);

        let fullText = '';
        for await (const event of chatApi.streamMessage(activeId, content, fileUrl, fileName, selectedModel)) {
          if (event.type === 'chunk') {
            fullText += event.text;
            setStreamingText(fullText);
          } else if (event.type === 'done') {
            queryClient.setQueryData<Message[]>(['messages', activeId], (prev = []) => [
              ...prev.filter((m) => m._id !== tempId && m._id !== 'error'),
              event.message,
            ]);
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            setStreamingText('');
          } else if (event.type === 'user_message') {
            queryClient.setQueryData<Message[]>(['messages', activeId], (prev = []) =>
              prev.map((m) => (m._id === tempId ? event.message : m)),
            );
          } else if (event.type === 'error') {
            const errorMessage: Message = {
              _id: 'error',
              conversationId: activeId,
              role: 'assistant',
              content: event.message,
              createdAt: new Date().toISOString(),
            };
            queryClient.setQueryData<Message[]>(['messages', activeId], (prev = []) => [
              ...prev.filter((m) => m._id !== tempId),
              errorMessage,
            ]);
            setStreamingText('');
          }
        }
      } catch (err) {
        console.error(err);
        setStreamingText('');
      } finally {
        setIsSending(false);
      }
    },
    [activeId, isSending, pendingFile, queryClient, selectedModel],
  );

  const handleHomePageSend = useCallback(
    async (content: string, file?: File) => {
      if (isSending) return;
      setIsSending(true);
      setStreamingText('');

      try {
        const conv = await chatApi.createConversation(content.slice(0, 50));
        queryClient.setQueryData<Conversation[]>(['conversations'], (prev = []) => [conv, ...prev]);
        setActiveId(conv._id);

        let fileUrl: string | undefined;
        let fileName: string | undefined;
        if (file) {
          const uploaded = await chatApi.uploadFile(file);
          fileUrl = uploaded.fileUrl;
          fileName = uploaded.fileName;
        }

        const newMessages: Message[] = [];
        let fullText = '';

        for await (const event of chatApi.streamMessage(conv._id, content, fileUrl, fileName, selectedModel)) {
          if (event.type === 'user_message') {
            newMessages[0] = event.message;
            queryClient.setQueryData<Message[]>(['messages', conv._id], [event.message]);
          } else if (event.type === 'chunk') {
            fullText += event.text;
            setStreamingText(fullText);
          } else if (event.type === 'done') {
            queryClient.setQueryData<Message[]>(['messages', conv._id], [
              ...(newMessages[0] ? [newMessages[0]] : []),
              event.message,
            ]);
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            setStreamingText('');
          }
        }
      } catch (err) {
        console.error(err);
        setStreamingText('');
      } finally {
        setIsSending(false);
      }
    },
    [isSending, queryClient, selectedModel],
  );

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeId,
        setActiveId,
        messages,
        loadingMessages,
        sending: isSending,
        streamingText,
        pendingFile,
        setPendingFile,
        handleCreate,
        handleSend,
        handleHomePageSend,
        handleDelete: (id: string) => deleteMutation.mutate(id),
        selectedModel,
        setSelectedModel,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
};
