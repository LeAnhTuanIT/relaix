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
  LayoutGrid,
  Bookmark,
  FolderKanban,
  LogIn,
  Zap,
} from 'lucide-react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const topNav: NavItem[] = [
  { icon: <Home size={20} />, label: 'Home', active: true },
  { icon: <FileText size={20} />, label: 'Document' },
  { icon: <Palette size={20} />, label: 'Design' },
  { icon: <MonitorPlay size={20} />, label: 'Presentation' },
  { icon: <ImageIcon size={20} />, label: 'Image' },
  { icon: <Video size={20} />, label: 'Video' },
  { icon: <MoreHorizontal size={20} />, label: 'More' },
];

const bottomNav: NavItem[] = [
  { icon: <LayoutGrid size={20} />, label: 'Templates' },
  { icon: <Bookmark size={20} />, label: 'Brand' },
  { icon: <FolderKanban size={20} />, label: 'Projects' },
];

function NavButton({ item }: { item: NavItem }) {
  return (
    <button
      className={cn(
        'flex flex-col items-center gap-1 py-2.5 px-1 w-full rounded-xl transition-all text-gray-400 hover:text-gray-900 hover:bg-gray-50',
        item.active && 'text-blue-600 bg-blue-50',
      )}
    >
      {item.icon}
      <span className="text-[10px] font-semibold leading-none">{item.label}</span>
    </button>
  );
}

export function Sidebar() {
  return (
    <aside className="flex-shrink-0 w-[72px] flex flex-col items-center border-r border-gray-100 bg-white h-full py-4 z-20">
      {/* Top nav */}
      <div className="flex flex-col gap-1 w-full px-1.5">
        {topNav.map((item) => (
          <NavButton key={item.label} item={item} />
        ))}
      </div>

      <div className="flex-1" />

      {/* Bottom nav */}
      <div className="flex flex-col gap-1 w-full px-1.5 pt-4 border-t border-gray-50">
        {bottomNav.map((item) => (
          <NavButton key={item.label} item={item} />
        ))}

        <button className="flex flex-col items-center gap-1 py-2.5 px-1 w-full rounded-xl transition-all text-gray-400 hover:text-gray-900 hover:bg-gray-50 mt-1">
          <LogIn size={20} />
          <span className="text-[10px] font-semibold leading-none">Sign in</span>
        </button>

        <button className="flex flex-col items-center gap-1 py-2.5 px-1 w-full rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-100 transition-all mt-2">
          <Zap size={20} fill="currentColor" />
          <span className="text-[10px] font-bold leading-none">Upgrade</span>
        </button>
      </div>
    </aside>
  );
}
