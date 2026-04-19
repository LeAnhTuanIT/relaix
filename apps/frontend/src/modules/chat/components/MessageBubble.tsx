'use client';

import { cn } from '@/shared/lib/utils';
import { type Message } from '@/shared/api/chat.api';
import { FilePreview } from './FilePreview';

interface MessageBubbleProps {
  message: Message;
}

const ASSISTANT_NAME = 'AI Chat';

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end mb-6">
        <div className="max-w-[60%]">
          {message.fileUrl && message.fileName ? (
            <div className="mb-2 flex justify-end">
              <FilePreview fileUrl={message.fileUrl} fileName={message.fileName} />
            </div>
          ) : null}
          <div className="bg-gray-100 text-gray-800 rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words inline-block">
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <p className="text-sm font-semibold text-gray-800 mb-2">{ASSISTANT_NAME}</p>
      <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
        <FormattedContent content={message.content} />
      </div>
      <span className="text-xs text-gray-400 mt-1 block">
        {new Date(message.createdAt).toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
    </div>
  );
}

function FormattedContent({ content }: { content: string }) {
  // Simple markdown-like formatting: **bold** and bullet lines
  const lines = content.split('\n');
  return (
    <>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('• ');
        const text = isBullet ? trimmed.slice(2) : line;
        const formatted = renderBold(text);

        if (isBullet) {
          return (
            <div key={i} className="flex gap-2 mb-1">
              <span className="text-gray-400 mt-0.5">•</span>
              <span>{formatted}</span>
            </div>
          );
        }
        return (
          <p key={i} className={cn('mb-1', !trimmed && 'h-2')}>
            {formatted}
          </p>
        );
      })}
    </>
  );
}

function renderBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
