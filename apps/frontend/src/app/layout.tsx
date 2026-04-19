import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/shared/providers/query-provider';

export const metadata: Metadata = {
  title: 'AI Chat',
  description: 'AI Chat application built with NestJS and Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
