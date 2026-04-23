import { type User } from '@relaix/shared';

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
  getConversations: async (): Promise<Conversation[]> => {
    const res = await fetch(`${API_URL}/chat/conversations`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch conversations');
    return res.json();
  },

  getMessages: async (conversationId: string): Promise<Message[]> => {
    const res = await fetch(`${API_URL}/chat/conversations/${conversationId}/messages`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  createConversation: async (title?: string): Promise<Conversation> => {
    const res = await fetch(`${API_URL}/chat/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to create conversation');
    return res.json();
  },

  deleteConversation: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/chat/conversations/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to delete conversation');
  },

  async *streamMessage(
    conversationId: string,
    content: string,
    fileUrl?: string,
    fileName?: string,
    model?: string,
  ): AsyncIterable<StreamEvent> {
    const res = await fetch(`${API_URL}/chat/conversations/${conversationId}/messages/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, fileUrl, fileName, model }),
      credentials: 'include',
    });

    if (!res.ok || !res.body) throw new Error('Stream failed');

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            yield JSON.parse(line.slice(6));
          } catch (e) {
            console.error('Failed to parse SSE line', line, e);
          }
        }
      }
    }
  },

  uploadFile: async (file: File): Promise<{ fileUrl: string; fileName: string }> => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${API_URL}/chat/upload`, {
      method: 'POST',
      body: form,
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to upload file');
    return res.json();
  },
};

export const authApi = {
  register: async (data: any): Promise<User> => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Registration failed');
    }
    return res.json();
  },

  login: async (data: any): Promise<User> => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }
    return res.json();
  },

  logout: async (): Promise<void> => {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  },

  getMe: async (): Promise<User> => {
    const res = await fetch(`${API_URL}/auth/me`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
  },

  getGoogleAuthUrl: () => `${API_URL}/auth/google`,
};
