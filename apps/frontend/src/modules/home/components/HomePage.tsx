'use client';

import { useState } from 'react';
import { Search, X, MessageCircle } from 'lucide-react';
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
  {
    title: 'Presentation',
    description:
      'Build a slide deck on renewable energy transition strategies for emerging markets in Southeast Asia',
  },
  {
    title: 'Social media',
    description:
      'Create a social media calendar for a fintech startup launching in Q3 2026 targeting Gen Z users',
  },
  {
    title: 'Design',
    description:
      'Design a minimalist brand identity kit including logo, color palette, and typography guide for a SaaS company',
  },
  {
    title: 'Whiteboard',
    description:
      'Create an organizational chart for a 200-person tech company with multiple product teams and reporting lines',
  },
];

const SparkleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-blue-600">
    <path
      d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
      fill="currentColor"
      opacity="0.8"
    />
    <path
      d="M19 2L19.75 4.75L22.5 5.5L19.75 6.25L19 9L18.25 6.25L15.5 5.5L18.25 4.75L19 2Z"
      fill="currentColor"
      opacity="0.5"
    />
  </svg>
);

interface HomePageProps {
  onSend: (content: string, file?: File) => void;
  sending: boolean;
}

export function HomePage({ onSend, sending }: HomePageProps) {
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="flex flex-col h-full overflow-auto bg-white">
      {/* Top navbar */}
      <header className="flex items-center justify-between px-8 py-4 flex-shrink-0">
        <div className="flex items-center gap-1">
          <span className="font-extrabold text-gray-900 text-lg tracking-tight">RELAIX</span>
          <span className="font-extrabold text-blue-600 text-lg tracking-tight">.AI</span>
        </div>
        <div className="flex items-center gap-5">
          <button className="text-gray-500 hover:text-gray-800 transition-colors">
            <Search size={18} />
          </button>
          <button className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
            Pricing
          </button>
          <button className="text-sm font-semibold text-gray-800 border border-gray-300 rounded-lg px-4 py-1.5 hover:bg-gray-50 transition-colors">
            Sign up
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-10 pb-6 flex-shrink-0">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight max-w-2xl">
          Generate Fully Editable Assets
        </h1>
        <p className="mt-4 text-gray-500 text-base max-w-2xl leading-relaxed">
          Prompt to free production-ready designs, documents, presentations, diagrams, charts and web
          assets in an all in one ai powered editor. Editable outputs with native exports.
        </p>

        {/* Input */}
        <div className="w-full max-w-2xl mt-8">
          <ChatInput
            onSend={(content) => onSend(content, pendingFile ?? undefined)}
            onFileSelect={setPendingFile}
            disabled={sending}
            pendingFile={pendingFile}
            onClearFile={() => setPendingFile(null)}
            appName="Enter text or voice to create..."
          />
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <span className="text-sm">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Trusted */}
        <div className="flex items-center gap-2 mt-5">
          <div className="flex -space-x-2">
            {['bg-pink-400', 'bg-orange-400', 'bg-blue-400', 'bg-green-400'].map((color, i) => (
              <div
                key={i}
                className={`w-7 h-7 rounded-full border-2 border-white ${color} flex items-center justify-center text-white text-xs font-bold`}
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <a href="#" className="text-sm text-blue-600 hover:underline font-medium">
            Trusted by 1,000,000+ creators, brands and small businesses
          </a>
        </div>
      </section>

      {/* What you can do */}
      <section className="px-8 py-8 flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-900 mb-6">What you can do with AI Chat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURE_CARDS.map((card, i) => (
            <button
              key={i}
              onClick={() => onSend(card.description)}
              className="text-left p-5 rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all bg-white group"
            >
              <div className="mb-3">
                <SparkleIcon />
              </div>
              <p className="font-semibold text-gray-900 text-sm mb-1.5">{card.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                {card.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Chat widget bottom-right */}
      {showChat ? (
        <div className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 w-72 z-50">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              AI
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-800">Hi there! How can I help you today?</p>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-colors z-50"
        >
          <MessageCircle size={22} />
        </button>
      )}
    </div>
  );
}
