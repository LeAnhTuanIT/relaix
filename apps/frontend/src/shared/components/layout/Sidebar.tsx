'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { LogIn, Crown, LogOut } from 'lucide-react';
import { NAV_ITEMS, type NavItem } from '@/shared/lib/navigation';
import { type User } from '@relaix/shared';

interface SidebarProps {
  user?: User | null;
  onLogout?: () => void;
}

function NavButton({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        'flex flex-col items-center gap-1.5 py-3 px-1 w-full rounded-2xl transition-all duration-200',
        active 
          ? 'text-blue-600 bg-blue-50/80 shadow-sm' 
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50',
      )}
    >
      <div className={cn('transition-transform duration-200', active && 'scale-110')}>
        {item.icon}
      </div>
      <span className="text-[11px] font-bold leading-none tracking-tight">{item.label}</span>
    </Link>
  );
}

export function Sidebar({ user, onLogout }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex-shrink-0 w-[80px] flex flex-col items-center border-r border-gray-100 bg-white h-full py-6 z-20 overflow-y-auto no-scrollbar">
      {/* Main nav items */}
      <div className="flex flex-col gap-1.5 w-full px-2">
        {NAV_ITEMS.map((item) => (
          <NavButton 
            key={item.label} 
            item={item} 
            active={pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))} 
          />
        ))}
      </div>

      <div className="flex-1" />

      {/* Bottom section */}
      <div className="flex flex-col gap-2 w-full px-2 mt-6">
        {user ? (
          <button 
            onClick={onLogout}
            className="flex flex-col items-center gap-1.5 py-3 px-1 w-full rounded-2xl transition-all text-red-400 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut size={22} />
            <span className="text-[11px] font-bold leading-none tracking-tight">Sign out</span>
          </button>
        ) : (
          <Link 
            href="/login"
            className="flex flex-col items-center gap-1.5 py-3 px-1 w-full rounded-2xl transition-all text-gray-500 hover:text-gray-900 hover:bg-gray-50"
          >
            <LogIn size={22} />
            <span className="text-[11px] font-bold leading-none tracking-tight">Sign in</span>
          </Link>
        )}

        <button className="flex flex-col items-center gap-1.5 py-4 px-1 w-full rounded-[24px] bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all transform active:scale-95 group">
          <Crown size={24} fill="white" className="group-hover:rotate-12 transition-transform" />
          <span className="text-[11px] font-black leading-none tracking-tight uppercase">Upgrade</span>
        </button>
      </div>
    </aside>
  );
}
