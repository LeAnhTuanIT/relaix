'use client';

import { FileText, Download } from 'lucide-react';

interface FilePreviewProps {
  fileUrl: string;
  fileName: string;
}

function isImage(fileName: string) {
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileName);
}

export function FilePreview({ fileUrl, fileName }: FilePreviewProps) {
  if (isImage(fileName)) {
    return (
      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fileUrl}
          alt={fileName}
          className="max-w-[240px] max-h-[180px] rounded-lg object-cover border border-white/20"
        />
      </a>
    );
  }

  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors max-w-[240px]"
    >
      <FileText size={16} className="flex-shrink-0" />
      <span className="text-sm truncate flex-1">{fileName}</span>
      <Download size={14} className="flex-shrink-0 opacity-70" />
    </a>
  );
}
