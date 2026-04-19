'use client';

import { cn } from '@/lib/utils';
import { type Message } from '@/lib/api';
import { FileText } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-3 mb-4', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
          isUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700',
        )}
      >
        {isUser ? 'U' : 'AI'}
      </div>

      {/* Bubble */}
      <div className={cn('max-w-[70%] flex flex-col gap-1', isUser ? 'items-end' : 'items-start')}>
        {message.fileName && (
          <div
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
              isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700',
            )}
          >
            <FileText size={14} />
            <span className="truncate max-w-[200px]">{message.fileName}</span>
          </div>
        )}
        <div
          className={cn(
            'px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words',
            isUser
              ? 'bg-blue-600 text-white rounded-tr-sm'
              : 'bg-gray-100 text-gray-800 rounded-tl-sm',
          )}
        >
          {message.content}
        </div>
        <span className="text-xs text-gray-400">
          {new Date(message.createdAt).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}
