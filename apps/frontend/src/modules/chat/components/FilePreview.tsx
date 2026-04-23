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
  // Hàm tạo URL tải xuống chuyên dụng của Cloudinary bằng cách thêm flag attachment
  const getDownloadUrl = (url: string) => {
    if (!url) return '';
    // Nếu là URL Cloudinary, thêm tham số để ép tải xuống
    if (url.includes('cloudinary.com')) {
      // Chèn fl_attachment vào sau /upload/
      return url.replace('/upload/', '/upload/fl_attachment/');
    }
    return url;
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Chúng ta sẽ để trình duyệt tự xử lý tải xuống qua link chuẩn 
    // để tránh các lỗi Unauthorized khi dùng fetch thủ công.
  };

  const downloadUrl = getDownloadUrl(fileUrl);

  if (isImage(fileName)) {
    return (
      <div className="relative group">
        <a 
          href={downloadUrl}
          download={fileName}
          onClick={handleDownload}
          className="cursor-pointer block transition-transform hover:scale-[1.02]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fileUrl}
            alt={fileName}
            className="max-w-[240px] max-h-[180px] rounded-xl object-cover border border-gray-200 shadow-sm"
          />
        </a>
        <a 
          href={downloadUrl}
          download={fileName}
          onClick={handleDownload}
          className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white text-gray-700"
        >
          <Download size={16} />
        </a>
      </div>
    );
  }

  const pdf = isPdf(fileName);

  return (
    <a
      href={downloadUrl}
      download={fileName}
      onClick={handleDownload}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl border transition-all max-w-[280px] shadow-sm cursor-pointer group',
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
      <Download size={16} className="flex-shrink-0 opacity-40 group-hover:opacity-100" />
    </a>
  );
}
