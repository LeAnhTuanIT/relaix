export interface AiAttachment {
  url: string;
  name?: string;
}

export abstract class AiProviderPort {
  abstract generateResponse(userContent: string, attachment?: AiAttachment, model?: string): Promise<string>;
  abstract streamResponse(userContent: string, attachment?: AiAttachment, model?: string): AsyncIterable<string>;
}
