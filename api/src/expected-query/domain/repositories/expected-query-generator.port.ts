import type { ExpectedQueryResponse } from '../entities/expected-query.entity';

export interface IExpectedQueryGeneratorPort {
  generate(prompt: string, schema: object): Promise<ExpectedQueryResponse>;
}
