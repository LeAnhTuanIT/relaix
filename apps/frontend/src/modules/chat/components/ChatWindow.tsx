'use client';

import { useEffect, useRef } from 'react';
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
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'auto' });
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
    <div 
      ref={scrollRef} 
      className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-white"
    >
      <div className="max-w-4xl mx-auto px-6 py-10 min-h-full flex flex-col">
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
        
        {/* Anchor for automatic scrolling */}
        <div ref={bottomRef} className="h-4 w-full flex-shrink-0" />
      </div>
    </div>
  );
}
