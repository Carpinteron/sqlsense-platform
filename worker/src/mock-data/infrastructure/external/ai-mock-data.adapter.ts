import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { IAiMockDataPort } from '../../domain/interfaces/ai-mock-data.port';
import type { MockDataSpec } from '../../domain/entities/mock-data.entity';

const SYSTEM_PROMPT = `You are a mock data generator for relational databases.
You receive a JSON specification describing a table: its name, number of rows, and field definitions with constraints.
Your job is to generate realistic mock data that strictly respects all field constraints.

CRITICAL: Respond with ONLY a valid JSON object. No markdown, no backticks, no explanation, no preamble.

Supported field types and their constraints:
- "foreign_key": integer ID referencing another table. Use realistic IDs (1 to a reasonable upper bound).
- "decimal": floating-point number within [min, max]. Use up to 2 decimal places.
- "int": integer within [min, max].
- "date": ISO date string (YYYY-MM-DD) within [from, to] range.
- "enum": one of the provided values array. Distribute values realistically across rows.
- "string": short realistic text appropriate for the field name.
- "boolean": true or false.
- "uuid": valid UUID v4 string.

Required output format:
{
  "table": "table_name",
  "data": [
    { "field1": value1, "field2": value2 },
    { "field1": value1, "field2": value2 }
  ]
}

Rules:
- Generate EXACTLY the number of rows specified in the input.
- ALL values MUST respect their field constraints (min/max, from/to, enum values list).
- Distribute enum and boolean values realistically — do not repeat the same value for every row.
- Foreign key IDs must be positive integers; vary them across rows.
- Dates must fall strictly within the specified [from, to] range.
- Output ONLY the JSON object, nothing else.`;

@Injectable()
export class AiMockDataAdapter implements IAiMockDataPort {
  constructor(private readonly config: ConfigService) {}

  async generateBatch(spec: MockDataSpec): Promise<Record<string, unknown>[]> {
    const endpoint = this.config.getOrThrow<string>('AI_ENDPOINT');
    const apiKey = this.config.getOrThrow<string>('AI_API_KEY');
    const model = this.config.getOrThrow<string>('AI_MODEL');
    const temperature = parseFloat(this.config.get('AI_TEMPERATURE', '0'));
    const maxTokens = Math.min(parseInt(this.config.get('AI_MAX_TOKENS', '4096'), 10), 4096);
    const timeout = parseInt(this.config.get('AI_TIMEOUT', '120000'), 10);

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
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: JSON.stringify(spec, null, 2) },
          ],
          temperature,
          max_tokens: maxTokens,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`AI API responded with ${res.status}: ${res.statusText} — ${body}`);
      }

      const data = (await res.json()) as { choices: { message: { content: string } }[] };
      const raw = data?.choices?.[0]?.message?.content ?? '';
      console.log(`[MockData Adapter] Raw response (first 300 chars): ${raw.slice(0, 300)}`);
      return this.parseResponse(raw);
    } catch (err) {
      console.error(`[MockData Adapter] AI call failed:`, err instanceof Error ? err.message : err);
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  private parseResponse(raw: string): Record<string, unknown>[] {
    let cleaned = raw.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

    const codeBlock = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlock) cleaned = codeBlock[1].trim();

    if (!cleaned.startsWith('{')) {
      const start = cleaned.indexOf('{');
      const end = cleaned.lastIndexOf('}');
      if (start !== -1 && end !== -1) cleaned = cleaned.slice(start, end + 1);
    }

    try {
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed?.data)) return parsed.data;
      console.warn(`[MockData Adapter] Parsed JSON but no data array. Keys: ${Object.keys(parsed ?? {}).join(', ')}`);
    } catch (err) {
      console.warn(`[MockData Adapter] JSON parse failed. Cleaned content: ${cleaned.slice(0, 200)}`);
    }
    return [];
  }
}
