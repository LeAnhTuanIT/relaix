'use client';

import { cn } from '@/shared/lib/utils';
import {
  Home,
  FileText,
  Palette,
  MonitorPlay,
  Image as ImageIcon,
  Video,
  MoreHorizontal,
  Layout,
  Folder,
  LogIn,
  Crown,
} from 'lucide-react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { icon: <Home size={22} />, label: 'Home', active: true },
  { icon: <FileText size={22} />, label: 'Document' },
  { icon: <Palette size={22} />, label: 'Design' },
  { icon: <MonitorPlay size={22} />, label: 'Presentation' },
  { icon: <ImageIcon size={22} />, label: 'Image' },
  { icon: <Video size={22} />, label: 'Video' },
  { icon: <MoreHorizontal size={22} />, label: 'More' },
  { icon: <Layout size={22} />, label: 'Templates' },
  { 
    icon: (
      <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-bold">
        B
      </div>
    ), 
    label: 'Brand' 
  },
  { icon: <Folder size={22} />, label: 'Projects' },
];

function NavButton({ item }: { item: NavItem }) {
  return (
    <button
      className={cn(
        'flex flex-col items-center gap-1.5 py-3 px-1 w-full rounded-2xl transition-all duration-200',
        item.active 
          ? 'text-blue-600 bg-blue-50/80 shadow-sm' 
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50',
      )}
    >
      <div className={cn('transition-transform duration-200', item.active && 'scale-110')}>
        {item.icon}
      </div>
      <span className="text-[11px] font-bold leading-none tracking-tight">{item.label}</span>
    </button>
  );
}

export function Sidebar() {
  return (
    <aside className="flex-shrink-0 w-[80px] flex flex-col items-center border-r border-gray-100 bg-white h-full py-6 z-20 overflow-y-auto no-scrollbar">
      {/* Main nav items */}
      <div className="flex flex-col gap-1.5 w-full px-2">
        {navItems.map((item) => (
          <NavButton key={item.label} item={item} />
        ))}
      </div>

      <div className="flex-1" />

      {/* Bottom section */}
      <div className="flex flex-col gap-2 w-full px-2 mt-6">
        <button className="flex flex-col items-center gap-1.5 py-3 px-1 w-full rounded-2xl transition-all text-gray-500 hover:text-gray-900 hover:bg-gray-50">
          <LogIn size={22} />
          <span className="text-[11px] font-bold leading-none tracking-tight">Sign in</span>
        </button>

        <button className="flex flex-col items-center gap-1.5 py-4 px-1 w-full rounded-[24px] bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all transform active:scale-95 group">
          <Crown size={24} fill="white" className="group-hover:rotate-12 transition-transform" />
          <span className="text-[11px] font-black leading-none tracking-tight uppercase">Upgrade</span>
        </button>
      </div>
    </aside>
  );
}
