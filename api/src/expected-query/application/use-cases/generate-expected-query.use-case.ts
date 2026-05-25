import { Injectable, Inject } from '@nestjs/common';
import type { IExpectedQueryGeneratorPort } from '../../domain/repositories/expected-query-generator.port';
import type { ExpectedQueryResponse } from '../../domain/entities/expected-query.entity';

@Injectable()
export class GenerateExpectedQueryUseCase {
  constructor(
    @Inject('IExpectedQueryGeneratorPort')
    private readonly generator: IExpectedQueryGeneratorPort,
  ) {}

  execute(prompt: string, schema: object): Promise<ExpectedQueryResponse> {
    return this.generator.generate(prompt, schema);
  }
}
