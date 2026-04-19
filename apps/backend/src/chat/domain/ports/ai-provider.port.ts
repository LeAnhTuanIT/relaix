export abstract class AiProviderPort {
  abstract generateResponse(userContent: string): Promise<string>;
  abstract streamResponse(userContent: string): AsyncIterable<string>;
}
