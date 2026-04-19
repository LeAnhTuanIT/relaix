'use client';

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { type Message } from '@/lib/api';
import { Loader2, MessageSquareDashed } from 'lucide-react';

interface ChatWindowProps {
  messages: Message[];
  loading: boolean;
  sending: boolean;
}

export function ChatWindow({ messages, loading, sending }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
        <MessageSquareDashed size={48} strokeWidth={1.5} />
        <p className="text-sm">Bắt đầu cuộc trò chuyện mới</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-6 max-w-3xl mx-auto">
        {messages.map((msg) => (
          <MessageBubble key={msg._id} message={msg} />
        ))}

        {sending && (
          <div className="flex gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
              AI
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
