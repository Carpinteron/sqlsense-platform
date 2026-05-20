import { ISqlExecutor, ExecutionContext, RunnerResponse } from '../../domain/interfaces/sql-executor.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SqlExecutorStub implements ISqlExecutor {
  async runInSandbox(context: ExecutionContext): Promise<RunnerResponse> {
    console.log('Simulando ejecución en Docker para:', context.studentQuery);
    
    return {
      status: 'SUCCESS',
      data: [{ id: 1, name: 'Test User' }], 
      executionTimeMs: 45,
      error: undefined
    };
  }
}