import { Injectable } from '@nestjs/common';
import { generateText, streamText } from 'ai';
import { AiProviderPort } from '../../domain/ports/ai-provider.port';

// Routes through Vercel AI Gateway — requires AI_GATEWAY_API_KEY or VERCEL_OIDC_TOKEN
// Swap model string to change provider: 'anthropic/claude-sonnet-4.6', 'google/gemini-3-flash', etc.
const MODEL = 'openai/gpt-5.4';

@Injectable()
export class VercelAiAdapter extends AiProviderPort {
  async generateResponse(userContent: string): Promise<string> {
    const { text } = await generateText({
      model: MODEL,
      messages: [{ role: 'user', content: userContent }],
    });
    return text;
  }

  async *streamResponse(userContent: string): AsyncIterable<string> {
    const result = streamText({
      model: MODEL,
      messages: [{ role: 'user', content: userContent }],
    });
    for await (const chunk of result.textStream) {
      yield chunk;
    }
  }
}
