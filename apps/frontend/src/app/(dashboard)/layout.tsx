'use client';

import { Sidebar } from "@/shared/components/layout/Sidebar";
import { Search, Sparkles, FileText, Layout, Image as ImageIcon, Video, Palette, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { NAV_ITEMS } from "@/shared/lib/navigation";
import { cn } from "@/shared/lib/utils";
import { useAuth } from "@/shared/providers/auth-provider";
import { useChat } from "@/modules/chat/providers/chat-provider";

const SEARCH_FILTERS = ["All", "AI Generators", "Templates", "Your Content"];

const AI_GENERATORS = [
  { label: 'Flyer - Generate with AI', icon: <Sparkles size={18} className="text-purple-500" /> },
  { label: 'Report - Generate with AI', icon: <FileText size={18} className="text-blue-500" /> },
  { label: 'Video - Generate with AI', icon: <Video size={18} className="text-red-500" /> },
  { label: 'Survey - Generate with AI', icon: <Layout size={18} className="text-green-500" /> },
  { label: 'Photo - Generate with AI', icon: <ImageIcon size={18} className="text-pink-500" /> },
  { label: 'Presentation - Generate with AI', icon: <Palette size={18} className="text-orange-500" /> },
];

const TEMPLATE_SUGGESTIONS = [
  { label: 'Resume Templates' },
  { label: 'Menu Templates' },
  { label: 'CV Templates' },
  { label: 'Logo Templates' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading, logout } = useAuth();
  const { activeId, setActiveId } = useChat();

  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredNavItems = NAV_ITEMS.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (authLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-sans">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 relative flex flex-col min-w-0 overflow-hidden">
        {/* Unified Header */}
        <header className="flex items-center gap-8 px-10 py-5 flex-shrink-0 bg-white z-30 border-b border-gray-50">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-1" onClick={() => setActiveId(null)}>
              <span className="font-black text-blue-600 text-xl tracking-tighter uppercase">
                TEMPLATE
              </span>
              <span className="font-medium text-gray-400 text-xl tracking-tighter">
                .NET
              </span>
            </Link>
          </div>
          
          <div className="flex-1 max-w-4xl mx-auto relative" ref={searchRef}>
            <div className={cn(
              "flex items-center w-full bg-white border-2 rounded-full px-5 py-2.5 transition-all duration-200",
              isSearching ? "border-blue-600 shadow-lg" : "border-gray-100 hover:border-gray-200"
            )}>
              <Search size={20} className={cn("transition-colors", isSearching ? "text-blue-600" : "text-gray-400")} />
              <input
                type="text"
                placeholder="Generate, Search Templates and your Content"
                className="bg-transparent border-none outline-none text-[15px] ml-3 w-full text-gray-700 font-medium placeholder:text-gray-400"
                value={searchQuery}
                onFocus={() => setIsSearching(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Large Search Dropdown */}
            {isSearching && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-[32px] shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="p-6">
                  {/* Filters */}
                  <div className="flex flex-wrap items-center gap-2 mb-8">
                    {SEARCH_FILTERS.map(filter => (
                      <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={cn(
                          "px-5 py-2 rounded-full text-sm font-bold transition-all border",
                          activeFilter === filter 
                            ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100" 
                            : "bg-white border-gray-100 text-gray-600 hover:border-gray-300"
                        )}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-6 max-h-[60vh] overflow-y-auto no-scrollbar">
                    {/* AI Generators Section */}
                    {(activeFilter === "All" || activeFilter === "AI Generators") && (
                      <div className="space-y-1">
                        {AI_GENERATORS.map((item, idx) => (
                          <div 
                            key={idx}
                            className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors">
                              {item.icon}
                            </div>
                            <span className="text-[15px] font-bold text-gray-700">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Template Suggestions Section */}
                    {(activeFilter === "All" || activeFilter === "Templates") && (
                      <div className="pt-4 border-t border-gray-50">
                        {TEMPLATE_SUGGESTIONS.map((item, idx) => (
                          <div 
                            key={idx}
                            className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors group"
                          >
                            <Search size={18} className="text-gray-400 ml-2" />
                            <span className="text-[15px] font-bold text-gray-700">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Navigation Items (Filtered) */}
                    {searchQuery && (
                      <div className="pt-4 border-t border-gray-50">
                        <p className="px-4 text-[13px] font-black text-gray-400 uppercase tracking-wider mb-2">Categories</p>
                        {filteredNavItems.map(item => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => { setIsSearching(false); setSearchQuery(""); }}
                            className="flex items-center gap-4 px-4 py-3 hover:bg-blue-50 rounded-2xl cursor-pointer transition-colors group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-white text-gray-400 group-hover:text-blue-600 transition-colors scale-90">
                              {item.icon}
                            </div>
                            <span className="text-[15px] font-bold text-gray-700 group-hover:text-blue-600">{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 flex-shrink-0">
            <Link href="/pricing" className="text-[15px] text-gray-600 hover:text-gray-900 font-bold transition-colors">
              Pricing
            </Link>
            {user ? (
              <div className="group relative">
                <Image 
                  src={(user as any).avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
                  alt={user.name}
                  width={36}
                  height={36}
                  unoptimized
                  className="w-9 h-9 rounded-full border border-gray-100 shadow-sm object-cover cursor-pointer hover:border-blue-400 transition-all"
                />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-[15px] text-gray-600 hover:text-gray-900 font-bold transition-colors">
                  Log in
                </Link>
                <Link href="/register" className="text-[15px] font-bold text-gray-800 border border-gray-200 rounded-xl px-5 py-2 hover:bg-gray-50 transition-colors shadow-sm">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex flex-col">
          {activeId && (
            <div className="px-10 py-4 border-b border-gray-50 bg-white">
              <button
                onClick={() => setActiveId(null)}
                className="flex items-center gap-2 text-[15px] font-bold text-gray-900 hover:text-blue-600 transition-colors group"
              >
                <ArrowLeft size={18} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
                Back to Templates
              </button>
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
