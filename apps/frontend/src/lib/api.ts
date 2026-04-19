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

export const api = {
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

  async sendMessage(
    conversationId: string,
    content: string,
    fileUrl?: string,
    fileName?: string,
  ): Promise<Message[]> {
    const res = await fetch(`${API_URL}/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, fileUrl, fileName }),
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  async uploadFile(file: File): Promise<{ fileUrl: string; fileName: string }> {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${API_URL}/chat/upload`, { method: 'POST', body: form });
    if (!res.ok) throw new Error('Failed to upload file');
    return res.json();
  },
};
