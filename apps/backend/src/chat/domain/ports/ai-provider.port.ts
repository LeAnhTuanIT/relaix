export interface AiAttachment {
  url: string;
  name?: string;
}

export interface AiMessage {
  role: 'user' | 'assistant';
  content: string;
  attachment?: AiAttachment;
}

export abstract class AiProviderPort {
  abstract generateResponse(history: AiMessage[], model?: string): Promise<string>;
  abstract streamResponse(history: AiMessage[], model?: string): AsyncIterable<string>;
}
