import { Injectable } from '@nestjs/common';
import { AiProviderPort } from '../../domain/ports/ai-provider.port';

@Injectable()
export class AiMockAdapter extends AiProviderPort {
  private readonly responses = [
    `Tôi hiểu câu hỏi của bạn. Đây là một chủ đề thú vị!`,
    `Cảm ơn bạn đã chia sẻ. Hãy để tôi phân tích thêm.`,
    `Đó là một câu hỏi hay! Có nhiều góc độ để xem xét vấn đề này.`,
    `Tôi sẽ giúp bạn khám phá chủ đề này sâu hơn.`,
  ];

  async generateResponse(userContent: string): Promise<string> {
    const base = this.responses[Math.floor(Math.random() * this.responses.length)];
    return `${base} (Phản hồi cho: "${userContent.slice(0, 30)}...")`;
  }

  async *streamResponse(userContent: string): AsyncIterable<string> {
    const full = await this.generateResponse(userContent);
    const words = full.split(' ');
    for (const word of words) {
      yield word + ' ';
      await new Promise((r) => setTimeout(r, 60));
    }
  }
}
