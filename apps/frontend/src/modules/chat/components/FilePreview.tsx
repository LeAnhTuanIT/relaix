'use client';

import { FileText, Download, FileCode } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface FilePreviewProps {
  fileUrl: string;
  fileName: string;
}

function isImage(fileName: string) {
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileName);
}

function isPdf(fileName: string) {
  return /\.pdf$/i.test(fileName);
}

export function FilePreview({ fileUrl, fileName }: FilePreviewProps) {
  if (isImage(fileName)) {
    return (
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block transition-transform hover:scale-[1.02]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fileUrl}
          alt={fileName}
          className="max-w-[240px] max-h-[180px] rounded-xl object-cover border border-gray-200 shadow-sm"
        />
      </a>
    );
  }

  const pdf = isPdf(fileName);

  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl border transition-all max-w-[280px] shadow-sm',
        pdf
          ? 'bg-red-50 border-red-100 hover:bg-red-100 text-red-700'
          : 'bg-gray-50 border-gray-100 hover:bg-gray-100 text-gray-700',
      )}
    >
      <div
        className={cn(
          'w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0',
          pdf ? 'bg-red-500 text-white' : 'bg-gray-500 text-white',
        )}
      >
        {pdf ? <FileText size={20} /> : <FileCode size={20} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{fileName}</p>
        <p className="text-[10px] opacity-60 uppercase font-bold tracking-wider">
          {pdf ? 'PDF Document' : 'Attachment'}
        </p>
      </div>
      <Download size={16} className="flex-shrink-0 opacity-40" />
    </a>
  );
}

