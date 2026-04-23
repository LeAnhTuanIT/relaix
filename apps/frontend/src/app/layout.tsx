import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/shared/providers/query-provider';
import { AuthProvider } from '@/shared/providers/auth-provider';
import { ChatProvider } from '@/modules/chat/providers/chat-provider';

export const metadata: Metadata = {
  title: 'AI Chat - Generate Fully Editable Assets | Template.net',
  description: 'Prompt to free production-ready designs, documents, presentations, diagrams, charts and web assets in an all in one ai powered editor.',
  keywords: ['AI Chat', 'Template.net', 'AI Design', 'Editable Assets', 'AI Editor'],
  authors: [{ name: 'Template.net' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <QueryProvider>
            <ChatProvider>
              {children}
            </ChatProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
