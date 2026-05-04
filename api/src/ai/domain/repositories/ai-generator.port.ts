export interface IAiGeneratorPort {
  complete(systemPrompt: string, userPrompt: string): Promise<string>;
}
