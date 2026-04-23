"use client";

import { type Message } from "@/shared/api/chat.api";
import { FilePreview } from "./FilePreview";
import { Search, FileText, Palette, LineChart, Presentation, Brain } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end mb-10">
        <div className="max-w-[85%] sm:max-w-[70%]">
          {message.fileUrl && message.fileName ? (
            <div className="mb-3 flex justify-end">
              <FilePreview fileUrl={message.fileUrl} fileName={message.fileName} />
            </div>
          ) : null}
          <div className="bg-[#f0f2f7] text-[#171717] rounded-[28px] px-6 py-3.5 text-[15px] font-medium leading-relaxed whitespace-pre-wrap break-words shadow-sm">
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12 group max-w-4xl">
      <div className="flex items-center gap-2 mb-4">
        {/* <p className="text-[15px] font-black text-gray-900 tracking-tight">{ASSISTANT_NAME}</p> */}
      </div>
      <div className="text-[16px] text-[#374151] leading-[1.8] font-medium">
        <FormattedContent content={message.content} isStreaming={isStreaming} />
      </div>
    </div>
  );
}

function FormattedContent({ content, isStreaming }: { content: string; isStreaming?: boolean }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-4">
      {lines.map((line, i) => {
        const trimmed = line.trim();

        // Handle headers
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={i} className="text-lg font-black text-gray-900 mt-6 mb-2">
              {renderBold(trimmed.slice(4))}
            </h3>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={i} className="text-xl font-black text-gray-900 mt-8 mb-4">
              {renderBold(trimmed.slice(3))}
            </h2>
          );
        }

        // Handle lists with specific icons like the image
        const isBullet =
          trimmed.startsWith("- ") || trimmed.startsWith("• ") || trimmed.startsWith("* ");
        if (isBullet) {
          const bulletContent = trimmed.slice(2);
          const lowerContent = bulletContent.toLowerCase();

          let icon = <Search size={16} className="text-gray-400" />;
          if (lowerContent.includes("document"))
            icon = <FileText size={16} className="text-gray-400" />;
          if (lowerContent.includes("design"))
            icon = <Palette size={16} className="text-gray-400" />;
          if (lowerContent.includes("data analysis"))
            icon = <LineChart size={16} className="text-gray-400" />;
          if (lowerContent.includes("presentation"))
            icon = <Presentation size={16} className="text-gray-400" />;
          if (lowerContent.includes("research"))
            icon = <Search size={16} className="text-gray-400" />;
          if (i === lines.length - 1 && isStreaming)
            icon = <Brain size={16} className="text-blue-400 animate-pulse" />;

          return (
            <div key={i} className="flex gap-3 ml-1 items-start py-1">
              <span className="mt-1.5 flex-shrink-0">{icon}</span>
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
              <span className="inline-block w-2 h-5 ml-1 bg-blue-600 animate-pulse align-middle rounded-full" />
            )}
          </p>
        );
      })}
    </div>
  );
}

function renderBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-black text-gray-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
