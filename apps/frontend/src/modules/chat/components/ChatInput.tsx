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
  Share2,
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
  menuDirection?: 'up' | 'down';
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
    description: 'Ultra-fast, multimodal AI from Google.',
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
  menuDirection = 'up',
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
      {/* Upload Menu */}
      {showUploadMenu && (
        <div 
          ref={uploadMenuRef}
          className={cn(
            "absolute left-0 w-[320px] bg-white rounded-[32px] shadow-[0_20px_70px_rgba(0,0,0,0.15)] border border-gray-100 py-4 z-[100] animate-in fade-in duration-300",
            menuDirection === 'up' ? "bottom-full mb-4 slide-in-from-bottom-4" : "top-full mt-4 slide-in-from-top-4"
          )}
        >
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-4 w-full px-6 py-3 hover:bg-gray-50 transition-colors text-left group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-white group-hover:shadow-md border border-transparent group-hover:border-gray-100 transition-all">
              <Cloud size={24} />
            </div>
            <div>
              <p className="text-[15px] font-bold text-gray-900">Upload files</p>
              <p className="text-[11px] text-gray-500 font-medium">Png, jpg, pdf and more</p>
            </div>
          </button>
          <button className="flex items-center gap-4 w-full px-6 py-3 hover:bg-gray-50 transition-colors text-left group">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-white group-hover:shadow-md border border-transparent group-hover:border-gray-100 transition-all">
              <Camera size={24} />
            </div>
            <div>
              <p className="text-[15px] font-bold text-gray-900">Take a photo</p>
              <p className="text-[11px] text-gray-500 font-medium">Use your camera to capture an image.</p>
            </div>
          </button>
          <button className="flex items-center gap-4 w-full px-6 py-3 hover:bg-gray-50 transition-colors text-left group border-b border-gray-50 pb-5">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-white group-hover:shadow-md border border-transparent group-hover:border-gray-100 transition-all">
              <Monitor size={24} />
            </div>
            <div>
              <p className="text-[15px] font-bold text-gray-900">Take a screenshot</p>
              <p className="text-[11px] text-gray-500 font-medium">Capture your screen, window or tab.</p>
            </div>
          </button>
          <div className="pt-4 px-2 space-y-1">
            <button className="flex items-center gap-4 w-full px-4 py-2.5 hover:bg-gray-50 rounded-2xl transition-colors text-left group">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-gray-600">
                <Layout size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Add logo</p>
                <p className="text-[10px] text-gray-400 leading-tight font-medium">Upload a logo to personalize your design.</p>
              </div>
            </button>
            <button className="flex items-center gap-4 w-full px-4 py-2.5 hover:bg-gray-50 rounded-2xl transition-colors text-left group">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-gray-600 font-black text-sm">
                B
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Apply brand</p>
                <p className="text-[10px] text-gray-400 leading-tight font-medium">Apply your brand for a consistent look in one click.</p>
              </div>
            </button>
            <button className="flex items-center gap-4 w-full px-4 py-2.5 hover:bg-gray-50 rounded-2xl transition-colors text-left group">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-gray-600">
                <Plus size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Add from Template.net</p>
                <p className="text-[10px] text-gray-400 leading-tight font-medium">Add recently used template in your project.</p>
              </div>
            </button>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50 px-2 space-y-1">
            <button className="flex items-center gap-4 w-full px-4 py-2.5 hover:bg-gray-50 rounded-2xl transition-colors text-left group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                <Cloud size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Microsoft OneDrive</p>
                <p className="text-[10px] text-gray-400 leading-tight font-medium">Connect to OneDrive to upload.</p>
              </div>
            </button>
            <button className="flex items-center gap-4 w-full px-4 py-2.5 hover:bg-gray-50 rounded-2xl transition-colors text-left group">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                <Share2 size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">HubSpot</p>
                <p className="text-[10px] text-gray-400 leading-tight font-medium">Connect to HubSpot to upload files.</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Model Selector Menu */}
      {showModelMenu && (
        <div 
          ref={modelMenuRef}
          className={cn(
            "absolute left-[100px] w-80 bg-white rounded-[32px] shadow-[0_20px_70px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-[100] animate-in fade-in duration-300",
            menuDirection === 'up' ? "bottom-full mb-4 slide-in-from-bottom-4" : "top-full mt-4 slide-in-from-top-4"
          )}
        >
          <div className="p-6 border-b border-gray-50">
            <p className="text-base font-black text-gray-900 mb-4 tracking-tight">Select AI Model</p>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search AI model"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all"
              />
            </div>
          </div>

          <div className="py-3">
            <div className="px-6 py-2 text-[11px] font-black text-gray-400 uppercase tracking-widest">
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
                  'flex items-start gap-4 w-full px-6 py-4 transition-all text-left',
                  selectedModel === model.id ? 'bg-blue-50/50' : 'hover:bg-gray-50',
                )}
              >
                <div className="mt-1">{model.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[15px] font-bold text-gray-900">{model.name}</p>
                    <Lock size={12} className="text-gray-400" />
                    {model.isNew && (
                      <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-black">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">{model.description}</p>
                </div>
                <div className="text-xs text-gray-400 font-bold">3 ✨</div>
              </button>
            ))}
          </div>
          <button className="w-full py-4 bg-gray-50 text-xs font-black text-gray-500 hover:text-gray-900 transition-colors border-t border-gray-100 flex items-center justify-center gap-2">
            See All <ChevronDown size={14} />
          </button>
        </div>
      )}

      {/* Main Input Container */}
      <div className="border border-gray-200 rounded-[32px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 focus-within:border-blue-400 focus-within:shadow-[0_8px_40px_rgba(59,130,246,0.1)]">
        {/* Upgrade Bar */}
        <div className="flex items-center gap-4 px-6 py-3 bg-[#f8f9fc] border-b border-gray-100 rounded-t-[32px]">
          <Sparkles size={18} className="text-blue-500" />
          <Bot size={18} className="text-gray-400" />
          <div className="h-4 w-[1px] bg-gray-200 mx-1" />
          <p className="text-[14px] text-gray-600 font-medium">
            <button className="text-blue-600 font-black hover:underline tracking-tight">Upgrade</button> for best
            quality, speed, and full control.
          </p>
          <div className="flex-1" />
          <button className="text-gray-400 hover:text-gray-900 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Textarea */}
        <div className="px-6 pt-5">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={appName}
            disabled={disabled}
            rows={1}
            className="w-full text-[16px] text-gray-900 placeholder:text-gray-400 focus:outline-none resize-none bg-transparent max-h-40 overflow-y-auto disabled:opacity-50 font-medium leading-relaxed"
          />
        </div>

        {/* Pending file */}
        {pendingFile && (
          <div className="flex items-center gap-3 mx-6 mt-3 bg-blue-50/50 border border-blue-100 rounded-[20px] px-4 py-2.5 text-sm text-blue-700 relative z-10 animate-in zoom-in-95 duration-200">
            <Paperclip size={16} className="text-blue-500" />
            <span className="truncate flex-1 font-bold">{pendingFile.name}</span>
            <button onClick={onClearFile} className="w-6 h-6 rounded-full flex items-center justify-center bg-white shadow-sm text-blue-400 hover:text-blue-600 transition-all">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Bottom toolbar */}
        <div className="flex items-center gap-3 px-5 py-4 relative">
          <button
            onClick={() => setShowUploadMenu(!showUploadMenu)}
            className={cn(
              'flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300',
              showUploadMenu ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 rotate-45' : 'text-gray-500 hover:bg-gray-100 hover:text-blue-600',
            )}
          >
            <Plus size={24} strokeWidth={2.5} />
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-2xl text-gray-700 hover:bg-gray-100 transition-all text-sm font-black tracking-tight">
            <Wrench size={16} className="text-gray-400" />
            Tools
          </button>

          <button
            onClick={() => setShowModelMenu(!showModelMenu)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-2xl text-gray-700 hover:bg-gray-100 transition-all text-sm font-black tracking-tight',
              showModelMenu && 'bg-gray-100 text-blue-600'
            )}
          >
            {currentModel.id.includes('claude') ? 'Claude Sonnet 4.6' : 'Gemini 1.5 Flash'}
            <ChevronDown size={16} className={cn('text-gray-400 transition-transform duration-300', showModelMenu && 'rotate-180')} />
          </button>

          <div className="flex-1" />

          <button
            type="button"
            className="p-2.5 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
          >
            <Mic size={20} />
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={disabled || (!value.trim() && !pendingFile)}
            className={cn(
              'flex items-center gap-2.5 px-6 py-2.5 rounded-[20px] font-black text-sm transition-all duration-300 shadow-lg',
              disabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                : !value.trim() && !pendingFile
                ? 'bg-gray-50 text-gray-300 cursor-not-allowed shadow-none'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 active:scale-95 hover:-translate-y-0.5',
            )}
          >
            {disabled ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <Sparkles size={18} fill="currentColor" />
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
