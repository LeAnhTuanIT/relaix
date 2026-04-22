'use client';

import { useState } from 'react';
import { Search, X, MessageCircle, LineChart } from 'lucide-react';
import { ChatInput } from '@/modules/chat/components/ChatInput';

const CATEGORIES = [
  { label: 'Document', icon: '📄' },
  { label: 'Design', icon: '🎨' },
  { label: 'Presentation', icon: '📊' },
  { label: 'Image', icon: '🖼️' },
  { label: 'Video', icon: '🎬' },
  { label: 'Whiteboard', icon: '📋' },
  { label: 'Social', icon: '💬' },
  { label: 'Chart', icon: '📈' },
];

const FEATURE_CARDS = [
  {
    title: 'Report',
    description:
      'Create a report analyzing the impact of the Ohio meteorite fall on local infrastructure and public safety',
  },
  {
    title: 'Report',
    description:
      'Create a report analyzing the impact of the USA–Iran–Israel tensions on global oil prices and trade routes',
  },
  {
    title: 'Business plan',
    description:
      'Create a business plan for a fuel trading startup post Middle East war 2026. Focus on supply chain gaps renewable transition opportunity',
  },
  {
    title: 'Data analyst',
    description:
      'Draft a data analyst report on how recent conflicts have impacted crude oil and gasoline supply data',
  },
];

interface HomePageProps {
  onSend: (content: string, file?: File) => void;
  sending: boolean;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export function HomePage({ onSend, sending, selectedModel, onModelChange }: HomePageProps) {
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative overflow-y-auto overflow-x-hidden custom-scrollbar">
      {/* Top navbar */}
      <header className="flex items-center justify-between px-10 py-5 flex-shrink-0 sticky top-0 bg-white/80 backdrop-blur-md z-30">
        <div className="flex items-center gap-1">
          <span className="font-black text-blue-600 text-xl tracking-tighter">TEMPLATE</span>
          <span className="font-medium text-gray-400 text-xl tracking-tighter">.NET</span>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-gray-500 hover:text-gray-800 transition-colors">
            <Search size={22} />
          </button>
          <button className="text-[15px] text-gray-600 hover:text-gray-900 font-bold transition-colors">
            Pricing
          </button>
          <button className="text-[15px] font-bold text-gray-800 border border-gray-200 rounded-xl px-5 py-2 hover:bg-gray-50 transition-colors shadow-sm">
            Sign up
          </button>
        </div>
      </header>

      {/* Hero Content */}
      <div className="flex-1 flex flex-col items-center">
        <section className="flex flex-col items-center text-center px-6 pt-16 pb-8 flex-shrink-0 w-full">
          <h1 className="text-5xl sm:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight max-w-4xl">
            Generate Fully Editable Assets
          </h1>
          <p className="mt-8 text-gray-500 text-lg max-w-2xl leading-relaxed font-medium">
            Prompt to free production-ready designs, documents, presentations, diagrams, charts and web
            assets in an all in one ai powered editor. Editable outputs with native exports.
          </p>

          {/* Input Area - Essential to have no overflow here */}
          <div className="w-full max-w-3xl mt-12 mb-6 relative z-40">
            <ChatInput
              onSend={(content) => onSend(content, pendingFile ?? undefined)}
              onFileSelect={setPendingFile}
              disabled={sending}
              pendingFile={pendingFile}
              onClearFile={() => setPendingFile(null)}
              appName="Enter text or voice to design a logo for a sustainable fashion startup named EcoWeave, featuring"
              selectedModel={selectedModel}
              onModelChange={onModelChange}
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-100 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold shadow-sm"
              >
                <span className="text-base">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Trusted Section */}
          <div className="flex items-center gap-3 mt-8">
            <div className="flex -space-x-3">
              {[
                'https://i.pravatar.cc/100?u=1',
                'https://i.pravatar.cc/100?u=2',
                'https://i.pravatar.cc/100?u=3',
                'https://i.pravatar.cc/100?u=4',
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="User"
                  className="w-9 h-9 rounded-full border-2 border-white shadow-sm object-cover"
                />
              ))}
            </div>
            <p className="text-sm text-blue-600 hover:underline font-bold cursor-pointer">
              Trusted by 1,000,000+ creators, brands and small businesses
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-10 py-20 w-full max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-10 tracking-tight">What you can do with Templates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURE_CARDS.map((card, i) => (
              <button
                key={i}
                onClick={() => onSend(card.description)}
                className="text-left p-8 rounded-[32px] border border-gray-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50/50 transition-all bg-white group flex flex-col h-[280px]"
              >
                <div className="mb-6 w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <LineChart size={24} />
                </div>
                <p className="font-black text-gray-900 text-lg mb-3 tracking-tight">{card.title}</p>
                <p className="text-[15px] text-gray-500 leading-relaxed line-clamp-4 font-medium">
                  {card.description}
                </p>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-blue-400/40 hover:bg-blue-700 hover:scale-105 transition-all z-50"
      >
        <MessageCircle size={26} fill="white" />
      </button>

      {showChat && (
        <div className="fixed bottom-24 right-8 bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 w-80 z-50 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-start gap-4">
            <img
              src="https://i.pravatar.cc/100?u=ai"
              alt="AI"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900 mb-1">AI Assistant</p>
              <p className="text-[13px] text-gray-600 leading-relaxed">Hi there! How can I help you today?</p>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
