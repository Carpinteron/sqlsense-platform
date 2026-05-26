import type { SemanticResult } from '../entities/semantic-result.entity';

export interface IQuerySemanticsPort {
  analyze(userQuery: string, expectedQuery: string): Promise<SemanticResult>;
}
