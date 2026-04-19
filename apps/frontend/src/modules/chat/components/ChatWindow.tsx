'use client';

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { type Message } from '@/shared/api/chat.api';
import { Loader2 } from 'lucide-react';

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
        <Loader2 className="animate-spin text-gray-300" size={28} />
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {messages.map((msg) => (
          <MessageBubble key={msg._id} message={msg} />
        ))}

        {sending && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-800 mb-2">AI Chat</p>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
