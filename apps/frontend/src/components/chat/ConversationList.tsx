'use client';

import { cn } from '@/lib/utils';
import { type Conversation } from '@/lib/api';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
}

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  onCreate,
  onDelete,
}: ConversationListProps) {
  return (
    <aside className="w-64 flex-shrink-0 bg-gray-900 text-gray-100 flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={onCreate}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          New Conversation
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-8">No conversations yet</p>
        )}
        {conversations.map((conv) => (
          <div
            key={conv._id}
            className={cn(
              'group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors',
              activeId === conv._id
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-800',
            )}
            onClick={() => onSelect(conv._id)}
          >
            <MessageSquare size={14} className="flex-shrink-0 text-gray-400" />
            <span className="flex-1 truncate text-sm">{conv.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(conv._id);
              }}
              className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
