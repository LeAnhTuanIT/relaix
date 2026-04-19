'use client';

import { useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Paperclip, Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (content: string) => void;
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  pendingFile?: File | null;
  onClearFile?: () => void;
}

export function ChatInput({
  onSend,
  onFileSelect,
  disabled,
  pendingFile,
  onClearFile,
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
    // Auto-resize textarea
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
    <div className="border-t border-gray-200 bg-white p-4">
      {pendingFile && (
        <div className="mb-2 flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm text-blue-700">
          <span className="truncate flex-1">{pendingFile.name}</span>
          <button onClick={onClearFile} className="text-blue-400 hover:text-blue-600 font-bold">
            ✕
          </button>
        </div>
      )}
      <div className="flex items-end gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors text-gray-500',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
          disabled={disabled}
          title="Upload file"
        >
          <Paperclip size={18} />
        </button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tin nhắn... (Enter để gửi, Shift+Enter xuống dòng)"
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition max-h-40 overflow-y-auto disabled:opacity-50"
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className={cn(
            'flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-blue-600 text-white transition-colors',
            disabled || !value.trim()
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-blue-700',
          )}
        >
          <Send size={16} />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/*,.pdf,.doc,.docx,.txt"
      />

      <p className="text-xs text-gray-400 mt-1.5 text-center">
        Enter để gửi · Shift+Enter xuống dòng · (+) để đính kèm file
      </p>
    </div>
  );
}
