'use client';

import { type Message } from '@/shared/api/chat.api';
import { FilePreview } from './FilePreview';

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

const ASSISTANT_NAME = 'AI Chat';

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end mb-8">
        <div className="max-w-[85%] sm:max-w-[70%]">
          {message.fileUrl && message.fileName ? (
            <div className="mb-2 flex justify-end">
              <FilePreview fileUrl={message.fileUrl} fileName={message.fileName} />
            </div>
          ) : null}
          <div className="bg-[#f4f4f4] text-[#171717] rounded-3xl px-5 py-3 text-[15px] leading-relaxed whitespace-pre-wrap break-words inline-block shadow-sm">
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 group">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full bg-[#c96442] flex items-center justify-center text-white text-[10px] font-bold">
          AI
        </div>
        <p className="text-sm font-semibold text-[#171717]">{ASSISTANT_NAME}</p>
      </div>
      <div className="text-[15px] text-[#374151] leading-7 pl-8">
        <FormattedContent content={message.content} isStreaming={isStreaming} />
      </div>
      {!isStreaming && (
        <span className="text-[11px] text-gray-400 mt-3 pl-8 block opacity-0 group-hover:opacity-100 transition-opacity">
          {new Date(message.createdAt).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      )}
    </div>
  );
}

function FormattedContent({ content, isStreaming }: { content: string; isStreaming?: boolean }) {
  const lines = content.split('\n');
  
  return (
    <div className="space-y-4">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        
        // Handle headers
        if (trimmed.startsWith('### ')) {
          return <h3 key={i} className="text-lg font-bold text-gray-900 mt-4 mb-2">{renderBold(trimmed.slice(4))}</h3>;
        }
        if (trimmed.startsWith('## ')) {
          return <h2 key={i} className="text-xl font-bold text-gray-900 mt-6 mb-3">{renderBold(trimmed.slice(3))}</h2>;
        }

        // Handle lists
        const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ');
        const isNumbered = /^\d+\.\s/.test(trimmed);

        if (isBullet || isNumbered) {
          const bulletContent = isBullet ? trimmed.slice(2) : trimmed.slice(trimmed.indexOf('.') + 1).trim();
          return (
            <div key={i} className="flex gap-3 ml-2">
              <span className="text-gray-400 flex-shrink-0">{isBullet ? '•' : trimmed.split('.')[0] + '.'}</span>
              <span className="flex-1">{renderBold(bulletContent)}</span>
            </div>
          );
        }

        // Handle empty lines
        if (!trimmed) return <div key={i} className="h-2" />;

        // Standard paragraph
        return (
          <p key={i} className="whitespace-pre-wrap">
            {renderBold(line)}
            {isStreaming && i === lines.length - 1 && (
              <span className="inline-block w-2 h-5 ml-1 bg-[#c96442] animate-pulse align-middle" />
            )}
          </p>
        );
      })}
    </div>
  );
}

function renderBold(text: string) {
  // Simple markdown bold: **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

