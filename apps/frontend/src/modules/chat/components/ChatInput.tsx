'use client';

import { useRef, useState, useCallback } from 'react';
import { cn } from '@/shared/lib/utils';
import {
  Plus,
  Loader2,
  Sparkles,
  X,
  SendHorizontal,
} from 'lucide-react';

interface ChatInputProps {
  onSend: (content: string) => void;
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  pendingFile?: File | null;
  onClearFile?: () => void;
  appName?: string;
  isFirstMessage?: boolean;
}

export function ChatInput({
  onSend,
  onFileSelect,
  disabled,
  pendingFile,
  onClearFile,
  appName = 'Ask template.net',
  isFirstMessage = true,
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
    if (file) {
      onFileSelect(file);
    }
    e.target.value = '';
  };

  const hasContent = value.trim().length > 0;
  const showGenerateButton = isFirstMessage && !hasContent && !pendingFile;

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4">
      <div className="border border-gray-200 rounded-[20px] bg-white shadow-sm transition-all duration-300 focus-within:border-blue-400 focus-within:shadow-md min-h-[140px] flex flex-col">
        {/* Textarea */}
        <div className="flex-1 px-6 pt-5">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={appName}
            disabled={disabled}
            rows={1}
            className="w-full text-[16px] text-gray-900 placeholder:text-gray-400 focus:outline-none resize-none bg-transparent disabled:opacity-50 font-medium leading-relaxed"
          />
        </div>

        {/* Pending file preview */}
        {pendingFile && (
          <div className="flex items-center gap-2 mx-6 mb-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs text-gray-600 w-fit">
            <span className="truncate max-w-[200px] font-medium">{pendingFile.name}</span>
            <button onClick={onClearFile} className="hover:text-red-500 transition-colors">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="flex items-center justify-center w-10 h-10 rounded-full text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all active:scale-95"
          >
            <Plus size={24} strokeWidth={2} />
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={disabled || (!value.trim() && !pendingFile)}
            className={cn(
              'flex items-center justify-center transition-all duration-200',
              showGenerateButton
                ? 'bg-[#2b26ff] text-white hover:bg-blue-700 active:scale-95 shadow-sm px-5 py-2.5 rounded-full font-bold text-[14px]'
                : (hasContent || pendingFile)
                  ? 'bg-[#2b26ff] text-white hover:bg-blue-700 active:scale-95 shadow-md w-10 h-10 rounded-full'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed w-10 h-10 rounded-full'
            )}
          >
            {disabled ? (
              <Loader2 size={18} className="animate-spin" />
            ) : showGenerateButton ? (
              <>
                <Sparkles size={16} fill="white" className="mr-2" />
                Generate Free
              </>
            ) : (
              <SendHorizontal size={20} className={cn((hasContent || pendingFile) ? "text-white" : "text-gray-400")} />
            )}
          </button>
        </div>
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
