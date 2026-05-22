import type { MockDataSpec } from '../entities/mock-data.entity';

export interface IAiMockDataPort {
  generateBatch(spec: MockDataSpec): Promise<Record<string, unknown>[]>;
}
