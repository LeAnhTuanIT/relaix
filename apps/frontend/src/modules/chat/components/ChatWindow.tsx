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
  streamingText?: string;
}

export function ChatWindow({ messages, loading, sending, streamingText }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, streamingText, sending]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-300" size={28} />
      </div>
    );
  }

  return (
    <ScrollArea ref={scrollRef} className="flex-1">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {messages.map((msg) => (
          <MessageBubble key={msg._id} message={msg} />
        ))}

        {streamingText && (
          <MessageBubble
            message={{
              _id: 'streaming',
              conversationId: '',
              role: 'assistant',
              content: streamingText,
              createdAt: new Date().toISOString(),
            }}
            isStreaming={true}
          />
        )}

        {sending && !streamingText && (
          <div className="mb-8 group pl-8">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#c96442] rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-[#c96442] rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-[#c96442] rounded-full animate-bounce" />
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
