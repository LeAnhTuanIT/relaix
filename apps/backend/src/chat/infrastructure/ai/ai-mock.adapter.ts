import { Injectable } from '@nestjs/common';
import { AiProviderPort, AiMessage } from '../../domain/ports/ai-provider.port';

@Injectable()
export class AiMockAdapter extends AiProviderPort {
  private readonly responses = [
    `Tôi hiểu câu hỏi của bạn. Đây là một chủ đề thú vị!`,
    `Cảm ơn bạn đã chia sẻ. Hãy để tôi phân tích thêm.`,
    `Đó là một câu hỏi hay! Có nhiều góc độ để xem xét vấn đề này.`,
    `Tôi sẽ giúp bạn khám phá chủ đề này sâu hơn.`,
  ];

  async generateResponse(history: AiMessage[]): Promise<string> {
    const lastMessage = history[history.length - 1];
    const userContent = lastMessage?.content || '';
    const base = this.responses[Math.floor(Math.random() * this.responses.length)];
    return `${base} (Phản hồi cho: "${userContent.slice(0, 30)}...")`;
  }

  async *streamResponse(history: AiMessage[]): AsyncIterable<string> {
    const full = await this.generateResponse(history);
    const words = full.split(' ');
    for (const word of words) {
      yield word + ' ';
      await new Promise((r) => setTimeout(r, 60));
    }
  }
}
