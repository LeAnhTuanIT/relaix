import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, streamText } from 'ai';
import { AiProviderPort, AiMessage, AiAttachment } from '../../domain/ports/ai-provider.port';
import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require('pdf-parse');

// Define specific types to avoid 'any' and linting errors
interface ExperimentalAttachment {
  url: string;
  name?: string;
  contentType: string;
}

interface CoreMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  experimental_attachments?: ExperimentalAttachment[];
}

@Injectable()
export class VercelAiAdapter extends AiProviderPort {
  private readonly anthropic;
  private readonly googleProvider;

  constructor(private readonly configService: ConfigService) {
    super();
    this.anthropic = createAnthropic({
      apiKey: this.configService.get<string>('ANTHROPIC_API_KEY'),
    });
    this.googleProvider = createGoogleGenerativeAI({
      apiKey: this.configService.get<string>('GOOGLE_GENERATIVE_AI_API_KEY'),
    });
  }

  private getModel(modelId?: string) {
    console.log('Phát hiện modelId yêu cầu:', modelId);
    if (modelId === 'claude-sonnet-4.6' || modelId?.includes('claude')) {
      return this.anthropic('claude-sonnet-4-20250514');
    }
    if (modelId === 'gemini-2.0-flash' || modelId?.includes('gemini')) {
      return this.googleProvider('gemini-flash-latest');
    }
    return this.anthropic('claude-sonnet-4-20250514');
  }

  private async getFileContext(attachment?: AiAttachment): Promise<{ 
    experimental_attachments?: ExperimentalAttachment[], 
    supplementaryText?: string 
  }> {
    if (!attachment || !attachment.url) return {};

    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(attachment.url);
    const isPdf = /\.pdf$/i.test(attachment.url);

    if (isImage) {
      return {
        experimental_attachments: [{
          url: attachment.url,
          name: attachment.name,
          contentType: `image/${attachment.url.split('.').pop()}`
        }]
      };
    }

    if (isPdf) {
      try {
        const response = await axios.get(attachment.url, { responseType: 'arraybuffer' });
        const data = await pdfParse(response.data);
        return {
          supplementaryText: `\n\n[Dữ liệu từ tệp đính kèm ${attachment.name || 'document.pdf'}]:\n${data.text}`
        };
      } catch (err) {
        console.error('Lỗi khi đọc PDF:', err);
        return { supplementaryText: `\n\n[Không thể đọc nội dung tệp ${attachment.name || 'document.pdf'}]` };
      }
    }

    return {};
  }

  private async mapHistoryToCoreMessages(history: AiMessage[]): Promise<CoreMessage[]> {
    const coreMessages: CoreMessage[] = [];

    for (const msg of history) {
      const { experimental_attachments, supplementaryText } = await this.getFileContext(msg.attachment);
      
      coreMessages.push({
        role: msg.role,
        content: msg.content + (supplementaryText || ''),
        experimental_attachments: experimental_attachments
      });
    }

    return coreMessages;
  }

  async generateResponse(history: AiMessage[], modelId?: string): Promise<string> {
    const model = this.getModel(modelId);
    const messages = await this.mapHistoryToCoreMessages(history);
    
    const { text } = await generateText({
      model: model,
      messages: messages as any,
    });
    return text;
  }

  async *streamResponse(history: AiMessage[], modelId?: string): AsyncIterable<string> {
    const model = this.getModel(modelId);
    const messages = await this.mapHistoryToCoreMessages(history);

    const result = streamText({
      model: model,
      messages: messages as any,
    });
    
    for await (const chunk of result.textStream) {
      yield chunk;
    }
  }
}
