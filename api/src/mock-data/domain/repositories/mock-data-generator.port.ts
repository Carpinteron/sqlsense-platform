import type { MockDataSpec, GenerateMockDataResponse } from '../entities/mock-data.entity';

export interface IMockDataGeneratorPort {
  generate(spec: MockDataSpec): Promise<GenerateMockDataResponse>;
}
