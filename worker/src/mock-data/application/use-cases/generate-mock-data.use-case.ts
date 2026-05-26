import { Injectable, Inject } from '@nestjs/common';
import type { IAiMockDataPort } from '../../domain/interfaces/ai-mock-data.port';
import type { MockDataSpec, ChunkResult } from '../../domain/entities/mock-data.entity';
import { validateRow } from '../../domain/entities/mock-data.entity';

const INITIAL_YIELD = 0.7;
const YIELD_FLOOR = 0.1;
const SAFETY_BUFFER = 5;
const MAX_BATCH_SIZE = 25;

@Injectable()
export class GenerateMockDataUseCase {
  constructor(
    @Inject('IAiMockDataPort')
    private readonly ai: IAiMockDataPort,
  ) {}

  async execute(spec: MockDataSpec): Promise<ChunkResult> {
    const target = spec.rows;
    let accumulated: Record<string, unknown>[] = [];
    let yieldRate = INITIAL_YIELD;
    const maxIterations = Math.max(8, Math.ceil(target / MAX_BATCH_SIZE / INITIAL_YIELD) * 2);

    for (let i = 0; i < maxIterations && accumulated.length < target; i++) {
      const remaining = target - accumulated.length;
      const requested = Math.min(
        Math.ceil(remaining / yieldRate) + SAFETY_BUFFER,
        MAX_BATCH_SIZE,
      );

      console.log(`[MockData] Iteration ${i + 1}: need ${remaining}, requesting ${requested}, yield=${(yieldRate * 100).toFixed(0)}%`);

      const batch = await this.ai.generateBatch({ ...spec, rows: requested });
      const valid = batch.filter(row => validateRow(row, spec.fields));

      if (batch.length > 0) {
        yieldRate = Math.max(valid.length / batch.length, YIELD_FLOOR);
      }

      console.log(`[MockData] Got ${valid.length}/${batch.length} valid rows`);
      accumulated = [...accumulated, ...valid];
    }

    return {
      table: spec.table,
      data: accumulated.slice(0, target),
    };
  }
}
