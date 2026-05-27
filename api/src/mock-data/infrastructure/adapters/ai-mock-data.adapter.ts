import { Injectable, Inject } from '@nestjs/common';
import type { IAiGeneratorPort } from '../../../ai/domain/repositories/ai-generator.port';
import type { IMockDataGeneratorPort } from '../../domain/repositories/mock-data-generator.port';
import type { MockDataSpec, GenerateMockDataResponse } from '../../domain/entities/mock-data.entity';
import { AiMockDataResponseMapper } from '../mappers/ai-mock-data-response.mapper';

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
export class AiMockDataAdapter implements IMockDataGeneratorPort {
  constructor(
    @Inject('IAiGeneratorPort') private readonly ai: IAiGeneratorPort,
    private readonly mapper: AiMockDataResponseMapper,
  ) {}

  async generate(spec: MockDataSpec): Promise<GenerateMockDataResponse> {
    const prompt = JSON.stringify(spec, null, 2);
    const raw = await this.ai.complete(SYSTEM_PROMPT, prompt);
    const { table, data } = this.mapper.parse(raw);
    return { table, count: data.length, sql: this.buildSql(table, data) };
  }

  private buildSql(table: string, data: Record<string, unknown>[]): string {
    if (data.length === 0) return '';
    const columns = Object.keys(data[0]);
    const values = data.map((row) => {
      const vals = columns.map((col) => {
        const v = row[col];
        if (v === null || v === undefined) return 'NULL';
        if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
        return String(v);
      });
      return `(${vals.join(', ')})`;
    });
    return `INSERT INTO ${table} (${columns.join(', ')}) VALUES\n${values.join(',\n')};`;
  }
}
