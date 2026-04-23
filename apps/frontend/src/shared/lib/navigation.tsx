import React from 'react';
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
} from 'lucide-react';

export interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { icon: <Home size={22} />, label: 'Home', href: '/' },
  { icon: <FileText size={22} />, label: 'Document', href: '/document' },
  { icon: <Palette size={22} />, label: 'Design', href: '/design' },
  { icon: <MonitorPlay size={22} />, label: 'Presentation', href: '/presentation' },
  { icon: <ImageIcon size={22} />, label: 'Image', href: '/image' },
  { icon: <Video size={22} />, label: 'Video', href: '/video' },
  { icon: <MoreHorizontal size={22} />, label: 'More', href: '/more' },
  { icon: <Layout size={22} />, label: 'Templates', href: '/templates' },
  { 
    icon: (
      <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-bold">
        B
      </div>
    ), 
    label: 'Brand',
    href: '/brand' 
  },
  { icon: <Folder size={22} />, label: 'Projects', href: '/projects' },
];
