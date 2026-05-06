import { Injectable, Inject } from '@nestjs/common';
import type { IMockDataGeneratorPort } from '../../domain/repositories/mock-data-generator.port';
import type { MockDataSpec, GenerateMockDataResponse } from '../../domain/entities/mock-data.entity';

@Injectable()
export class GenerateMockDataUseCase {
  constructor(
    @Inject('IMockDataGeneratorPort')
    private readonly generator: IMockDataGeneratorPort,
  ) {}

  execute(spec: MockDataSpec): Promise<GenerateMockDataResponse> {
    return this.generator.generate(spec);
  }
}
