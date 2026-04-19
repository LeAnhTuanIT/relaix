'use client';

import { useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
  Plus,
  Wrench,
  ChevronDown,
  Mic,
  Square,
  Paperclip,
  RefreshCw,
  Settings,
  Zap,
  X,
} from 'lucide-react';

interface ChatInputProps {
  onSend: (content: string) => void;
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  pendingFile?: File | null;
  onClearFile?: () => void;
  appName?: string;
}

export function ChatInput({
  onSend,
  onFileSelect,
  disabled,
  pendingFile,
  onClearFile,
  appName = 'AI Chat',
}: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [value, disabled, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    e.target.value = '';
  };

  return (
    <div className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden">
      {/* Top toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          title="Attach file"
        >
          <Paperclip size={16} />
        </button>
        <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
          <RefreshCw size={16} />
        </button>
        <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
          <Settings size={16} />
        </button>
        <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
          <Zap size={16} />
        </button>

        <div className="flex-1" />

        <span className="text-xs text-gray-400 hidden sm:block">
          Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px]">Enter</kbd> to send ·{' '}
          <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px]">Shift+Enter</kbd> for new line
        </span>
      </div>

      {/* Pending file */}
      {pendingFile && (
        <div className="flex items-center gap-2 mx-3 mt-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 text-sm text-blue-700">
          <span className="truncate flex-1 text-xs">{pendingFile.name}</span>
          <button onClick={onClearFile} className="text-blue-400 hover:text-blue-600">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={`Ask ${appName}`}
        disabled={disabled}
        rows={2}
        className="w-full px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none resize-none bg-transparent max-h-40 overflow-y-auto disabled:opacity-50"
      />

      {/* Bottom toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-t border-gray-100">
        <button className="flex items-center justify-center w-7 h-7 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors">
          <Plus size={16} />
        </button>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors text-xs font-medium">
          <Wrench size={13} />
          Tools
        </button>

        <button className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors text-xs font-medium">
          Light AI
          <ChevronDown size={12} />
        </button>

        <div className="flex-1" />

        <button
          type="button"
          className={cn(
            'p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors',
            disabled && 'opacity-50',
          )}
        >
          <Mic size={17} />
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className={cn(
            'w-8 h-8 flex items-center justify-center rounded-full transition-colors',
            disabled || !value.trim()
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700',
          )}
        >
          <Square size={13} fill="currentColor" />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
    </div>
  );
}
