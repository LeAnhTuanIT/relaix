import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, streamText } from 'ai';
import { AiProviderPort, AiAttachment } from '../../domain/ports/ai-provider.port';
import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require('pdf-parse');

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
    // Map friendly IDs to actual model identifiers from the provided image
    if (modelId === 'claude-sonnet-4.6' || modelId?.includes('claude')) {
      return this.anthropic('claude-sonnet-4-20250514');
    }
    if (modelId === 'gemini-2.0-flash' || modelId?.includes('gemini')) {
      console.log('Đang dùng Google Gemini Flash Latest (gemini-flash-latest)');
      return this.googleProvider('gemini-flash-latest');
    }
    
    return this.anthropic('claude-sonnet-4-20250514');
  }

  private async getFileContext(attachment?: AiAttachment): Promise<{ 
    experimental_attachments?: any[], 
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

  async generateResponse(userContent: string, attachment?: AiAttachment, modelId?: string): Promise<string> {
    const { experimental_attachments, supplementaryText } = await this.getFileContext(attachment);
    const model = this.getModel(modelId);
    
    const { text } = await generateText({
      model: model,
      messages: [{ 
        role: 'user', 
        content: userContent + (supplementaryText || ''),
        experimental_attachments
      } as any],
    });
    return text;
  }

  async *streamResponse(userContent: string, attachment?: AiAttachment, modelId?: string): AsyncIterable<string> {
    const { experimental_attachments, supplementaryText } = await this.getFileContext(attachment);
    const model = this.getModel(modelId);

    const result = streamText({
      model: model,
      messages: [{ 
        role: 'user', 
        content: userContent + (supplementaryText || ''),
        experimental_attachments
      } as any],
    });
    
    for await (const chunk of result.textStream) {
      yield chunk;
    }
  }
}
