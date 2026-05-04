import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  constructor(private readonly config: ConfigService) {}

  async complete(systemPrompt: string, userPrompt: string): Promise<string> {
    const endpoint = this.config.getOrThrow<string>('AI_ENDPOINT');
    const apiKey = this.config.getOrThrow<string>('AI_API_KEY');
    const model = this.config.getOrThrow<string>('AI_MODEL');
    const temperature = parseFloat(this.config.get('AI_TEMPERATURE', '0'));
    const maxTokens = parseInt(this.config.get('AI_MAX_TOKENS', '2048'), 10);
    const timeout = parseInt(this.config.get('AI_TIMEOUT', '30000'), 10);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature,
          max_tokens: maxTokens,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new InternalServerErrorException(
          `AI API responded with ${res.status}: ${res.statusText}`,
        );
      }

      const data = (await res.json()) as {
        choices: { message: { content: string } }[];
      };
      const content = data?.choices?.[0]?.message?.content;

      if (!content) {
        throw new InternalServerErrorException('AI returned an empty response');
      }

      return content;
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new InternalServerErrorException('AI request timed out');
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }
}
