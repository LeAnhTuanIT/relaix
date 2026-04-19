export abstract class AiProviderPort {
  abstract generateResponse(userContent: string): Promise<string>;
}
