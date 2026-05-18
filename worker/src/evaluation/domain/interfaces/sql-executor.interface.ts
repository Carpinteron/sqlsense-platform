export type RunnerStatus = 
  | 'SUCCESS' 
  | 'SYNTAX_ERROR' 
  | 'TIME_LIMIT_EXCEEDED' 
  | 'RUNTIME_ERROR';

export interface ExecutionContext {
  schema: string;       
  seed: string;      
  studentQuery: string;
}

export interface RunnerResponse {
  status: RunnerStatus; 
  data: any[] | null;
  error?: string;   
  executionTimeMs: number;
}

export interface ISqlExecutor {
  runInSandbox(context: ExecutionContext): Promise<RunnerResponse>;
}