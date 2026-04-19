const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Message {
  _id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export type StreamEvent =
  | { type: 'user_message'; message: Message }
  | { type: 'chunk'; text: string }
  | { type: 'done'; message: Message }
  | { type: 'error'; message: string };

export const chatApi = {
  async getConversations(): Promise<Conversation[]> {
    const res = await fetch(`${API_URL}/chat/conversations`);
    if (!res.ok) throw new Error('Failed to fetch conversations');
    return res.json();
  },

  async createConversation(title?: string): Promise<Conversation> {
    const res = await fetch(`${API_URL}/chat/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error('Failed to create conversation');
    return res.json();
  },

  async deleteConversation(id: string): Promise<void> {
    await fetch(`${API_URL}/chat/conversations/${id}`, { method: 'DELETE' });
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const res = await fetch(`${API_URL}/chat/conversations/${conversationId}/messages`);
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  async *streamMessage(
    conversationId: string,
    content: string,
    fileUrl?: string,
    fileName?: string,
  ): AsyncIterable<StreamEvent> {
    const res = await fetch(`${API_URL}/chat/conversations/${conversationId}/messages/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, fileUrl, fileName }),
    });

    if (!res.ok || !res.body) throw new Error('Stream failed');

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n\n');
      buffer = parts.pop() ?? '';

      for (const part of parts) {
        const line = part.trim();
        if (line.startsWith('data: ')) {
          yield JSON.parse(line.slice(6)) as StreamEvent;
        }
      }
    }
  },

  async uploadFile(file: File): Promise<{ fileUrl: string; fileName: string }> {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${API_URL}/chat/upload`, { method: 'POST', body: form });
    if (!res.ok) throw new Error('Failed to upload file');
    return res.json();
  },
};
