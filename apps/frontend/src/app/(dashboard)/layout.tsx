'use client';

import { Sidebar } from "@/shared/components/layout/Sidebar";
import { Search, X, Sparkles, FileText, Layout, Image as ImageIcon, Video, Palette, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { NAV_ITEMS } from "@/shared/lib/navigation";
import { cn } from "@/shared/lib/utils";
import { useAuth } from "@/shared/providers/auth-provider";
import { useRouter, usePathname } from "next/navigation";
import { useChat } from "@/modules/chat/hooks/useChat";

const SEARCH_FILTERS = ["All", "AI Generators", "Templates", "Your Content"];

const AI_GENERATORS = [
  { label: 'Flyer - Generate with AI', icon: <Sparkles size={18} className="text-purple-500" /> },
  { label: 'Report - Generate with AI', icon: <FileText size={18} className="text-blue-500" /> },
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
  const router = useRouter();
  const pathname = usePathname();
  
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredNavItems = NAV_ITEMS.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!authLoading && !user && pathname !== '/login' && pathname !== '/register') {
      router.push('/login');
    }
  }, [user, authLoading, router, pathname]);

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

  if (!user && pathname !== '/login' && pathname !== '/register') return null;

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-sans">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 relative flex flex-col min-w-0 overflow-hidden">
        {/* Unified Header */}
        <header className="flex items-center gap-8 px-10 py-5 flex-shrink-0 bg-white z-30 border-b border-gray-50">
          <div className="flex items-center gap-8">
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

            {activeId && (
              <button
                onClick={() => setActiveId(null)}
                className="flex items-center gap-2 text-[15px] font-bold text-gray-900 hover:text-blue-600 transition-colors border-l border-gray-100 pl-8 ml-2"
              >
                <ArrowLeft size={18} strokeWidth={3} />
                Back
              </button>
            )}
          </div>
          
          <div className="flex-1 max-w-2xl mx-auto relative" ref={searchRef}>
            <div className={cn(
              "flex items-center w-full bg-white border-2 rounded-full px-5 py-2 transition-all duration-200",
              isSearching ? "border-blue-600 shadow-lg" : "border-gray-100 hover:border-gray-200"
            )}>
              <Search size={18} className={cn("transition-colors", isSearching ? "text-blue-600" : "text-gray-400")} />
              <input
                type="text"
                placeholder="Generate or Search..."
                className="bg-transparent border-none outline-none text-sm ml-3 w-full text-gray-700 font-medium placeholder:text-gray-400"
                value={searchQuery}
                onFocus={() => setIsSearching(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {isSearching && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-[24px] shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="p-4">
                  <div className="space-y-1">
                    {AI_GENERATORS.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors group">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white">{item.icon}</div>
                        <span className="text-sm font-bold text-gray-700">{item.label}</span>
                      </div>
                    ))}
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
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
                  alt={user.name}
                  className="w-9 h-9 rounded-full border border-gray-100 shadow-sm object-cover cursor-pointer hover:border-blue-400 transition-all"
                />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-[15px] text-gray-600 hover:text-gray-900 font-bold transition-colors">
                  Log in
                </Link>
                <Link href="/register" className="text-[15px] font-bold text-white bg-blue-600 rounded-xl px-5 py-2 hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
