'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { cn } from '@/shared/lib/utils';
import {
  Plus,
  Wrench,
  ChevronDown,
  Mic,
  Paperclip,
  Loader2,
  Sparkles,
  Search,
  Camera,
  Monitor,
  Cloud,
  Layout,
  Bot,
  BrainCircuit,
  Lock,
  X,
} from 'lucide-react';

interface ChatInputProps {
  onSend: (content: string) => void;
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  pendingFile?: File | null;
  onClearFile?: () => void;
  appName?: string;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const MODELS = [
  {
    id: 'claude-sonnet-4.6',
    name: 'Anthropic Claude Sonnet 4.6',
    description: 'Human-like writing with premium tone.',
    icon: <Sparkles size={16} className="text-purple-500" />,
    isNew: true,
    provider: 'Anthropic',
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Google Gemini 2.0 Flash',
    description: 'Smart, detailed reasoning and clear answers.',
    icon: <BrainCircuit size={16} className="text-blue-500" />,
    isNew: true,
    provider: 'Google',
  },
];

export function ChatInput({
  onSend,
  onFileSelect,
  disabled,
  pendingFile,
  onClearFile,
  appName = 'AI Chat',
  selectedModel,
  onModelChange,
}: ChatInputProps) {
  const [value, setValue] = useState('');
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMenuRef = useRef<HTMLDivElement>(null);
  const modelMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (uploadMenuRef.current && !uploadMenuRef.current.contains(event.target as Node)) {
        setShowUploadMenu(false);
      }
      if (modelMenuRef.current && !modelMenuRef.current.contains(event.target as Node)) {
        setShowModelMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      setShowUploadMenu(false);
    }
    e.target.value = '';
  };

  const currentModel = MODELS.find((m) => m.id === selectedModel) || MODELS[0];

  return (
    <div className="relative w-full">
      <div className="border border-gray-200 rounded-3xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden transition-all focus-within:border-blue-400 focus-within:shadow-[0_2px_20px_rgba(59,130,246,0.08)]">
        {/* Upgrade Bar */}
        <div className="flex items-center gap-3 px-5 py-2.5 bg-[#f8f9fc] border-b border-gray-100">
          <Sparkles size={16} className="text-gray-400" />
          <Bot size={16} className="text-gray-400" />
          <div className="h-3 w-[1px] bg-gray-200 mx-1" />
          <p className="text-[13px] text-gray-600">
            <button className="text-blue-600 font-bold hover:underline">Upgrade</button> for best
            quality, speed, and full control.
          </p>
          <div className="flex-1" />
          <button className="text-gray-400 hover:text-gray-600">
            <X size={14} />
          </button>
        </div>

        {/* Textarea */}
        <div className="px-5 pt-4">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={appName}
            disabled={disabled}
            rows={1}
            className="w-full text-base text-gray-800 placeholder:text-gray-400 focus:outline-none resize-none bg-transparent max-h-40 overflow-y-auto disabled:opacity-50"
          />
        </div>

        {/* Pending file */}
        {pendingFile && (
          <div className="flex items-center gap-2 mx-5 mt-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 text-sm text-blue-700">
            <Paperclip size={14} className="text-blue-500" />
            <span className="truncate flex-1 text-xs font-medium">{pendingFile.name}</span>
            <button onClick={onClearFile} className="text-blue-400 hover:text-blue-600">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Bottom toolbar */}
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="relative" ref={uploadMenuRef}>
            <button
              onClick={() => setShowUploadMenu(!showUploadMenu)}
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-full transition-colors',
                showUploadMenu ? 'bg-gray-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100',
              )}
            >
              {showUploadMenu ? <X size={20} /> : <Plus size={20} />}
            </button>

            {showUploadMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600">
                    <Cloud size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Upload files</p>
                    <p className="text-[10px] text-gray-500">Png, jpg, pdf and more</p>
                  </div>
                </button>
                <button className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-left">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600">
                    <Camera size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Take a photo</p>
                    <p className="text-[10px] text-gray-500">Use your camera to capture an image.</p>
                  </div>
                </button>
                <button className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600">
                    <Monitor size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Take a screenshot</p>
                    <p className="text-[10px] text-gray-500">Capture your screen, window or tab.</p>
                  </div>
                </button>
                <div className="pt-1">
                  <button className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-50 transition-colors text-left">
                    <Layout size={16} className="text-gray-400" />
                    <span className="text-xs text-gray-600">Add from Template.net</span>
                  </button>
                  <button className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-50 transition-colors text-left">
                    <Cloud size={16} className="text-blue-500" />
                    <span className="text-xs text-gray-600">Microsoft OneDrive</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-gray-600 hover:bg-gray-100 transition-colors text-xs font-semibold">
            <Wrench size={14} className="text-gray-400" />
            Tools
          </button>

          <div className="relative" ref={modelMenuRef}>
            <button
              onClick={() => setShowModelMenu(!showModelMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-gray-600 hover:bg-gray-100 transition-colors text-xs font-semibold"
            >
              {currentModel.id.includes('claude') ? 'Claude Sonnet 4.6' : 'Gemini 2.0 Flash'}
              <ChevronDown size={14} className="text-gray-400" />
            </button>

            {showModelMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="p-4 border-b border-gray-50">
                  <p className="text-sm font-bold text-gray-800 mb-3">Select AI Model</p>
                  <div className="relative">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search AI model"
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </div>
                </div>

                <div className="py-2">
                  <div className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Text
                  </div>
                  {MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        onModelChange(model.id);
                        setShowModelMenu(false);
                      }}
                      className={cn(
                        'flex items-start gap-3 w-full px-4 py-3 transition-colors text-left',
                        selectedModel === model.id ? 'bg-blue-50/50' : 'hover:bg-gray-50',
                      )}
                    >
                      <div className="mt-0.5">{model.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-gray-800">{model.name}</p>
                          <Lock size={10} className="text-gray-400" />
                          {model.isNew && (
                            <span className="text-[9px] bg-blue-100 text-blue-600 px-1.5 rounded-full font-bold">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-500 mt-0.5">{model.description}</p>
                      </div>
                      <div className="text-[10px] text-gray-400 font-medium">3 ✨</div>
                    </button>
                  ))}
                </div>
                <button className="w-full py-2 bg-gray-50 text-[10px] font-bold text-gray-500 hover:text-gray-700 transition-colors border-t border-gray-100 flex items-center justify-center gap-1">
                  See All <ChevronDown size={10} />
                </button>
              </div>
            )}
          </div>

          <div className="flex-1" />

          <button
            type="button"
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Mic size={18} />
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={disabled || (!value.trim() && !pendingFile)}
            className={cn(
              'flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all duration-200',
              disabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : !value.trim() && !pendingFile
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 active:scale-95',
            )}
          >
            {disabled ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <Sparkles size={16} fill="currentColor" />
                Generate
              </>
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
