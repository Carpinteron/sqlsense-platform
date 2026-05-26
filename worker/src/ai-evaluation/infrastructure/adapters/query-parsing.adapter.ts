import { Injectable } from '@nestjs/common';
import type { IQueryParsingPort } from '../../domain/repositories/query-parsing.port';
import type {
  PerformanceAnalysis,
  PerformanceIssue,
} from '../../domain/entities/performance-analysis.entity';

@Injectable()
export class QueryParsingAdapter implements IQueryParsingPort {
  parse(explainAnalyze: string | object, executionTimeMs: number): PerformanceAnalysis {
    let plan: any;
    if (typeof explainAnalyze === 'string') {
      try {
        plan = JSON.parse(explainAnalyze);
      } catch {
        return this._fallback(executionTimeMs);
      }
    } else {
      plan = explainAnalyze;
    }

    // PostgreSQL EXPLAIN (ANALYZE, FORMAT JSON) returns an array
    const root = Array.isArray(plan) ? plan[0] : plan;
    const planningTimeMs: number = root?.['Planning Time'] ?? 0;
    const resolvedExecutionTimeMs: number = root?.['Execution Time'] ?? executionTimeMs;

    const seqScans = this._countNodes(root?.Plan, 'Seq Scan');
    const indexScans = this._countNodes(root?.Plan, 'Index Scan') +
      this._countNodes(root?.Plan, 'Index Only Scan');
    const nestedLoops = this._countNodes(root?.Plan, 'Nested Loop');
    const sortOperations = this._countNodes(root?.Plan, 'Sort');

    const issues: PerformanceIssue[] = [];
    if (seqScans > 0) issues.push('POSSIBLE_MISSING_INDEX');
    if (nestedLoops >= 2) issues.push('EXPENSIVE_NESTED_LOOP');
    if (sortOperations > 0) issues.push('EXPENSIVE_SORT');

    return {
      performance: {
        executionTimeMs: resolvedExecutionTimeMs,
        planningTimeMs,
        seqScans,
        indexScans,
        nestedLoops,
        sortOperations,
      },
      issues,
    };
  }

  private _countNodes(node: any, nodeType: string): number {
    if (!node || typeof node !== 'object') return 0;
    let count = node['Node Type'] === nodeType ? 1 : 0;
    for (const child of node['Plans'] ?? []) {
      count += this._countNodes(child, nodeType);
    }
    return count;
  }

  private _fallback(executionTimeMs: number): PerformanceAnalysis {
    return {
      performance: {
        executionTimeMs,
        planningTimeMs: 0,
        seqScans: 0,
        indexScans: 0,
        nestedLoops: 0,
        sortOperations: 0,
      },
      issues: [],
    };
  }
}
