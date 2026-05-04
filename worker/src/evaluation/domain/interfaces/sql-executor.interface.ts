export interface ExecutionContext {
  schema: string;       
  seed: string;      
  studentQuery: string;
}

export interface RunnerResponse {
  success: boolean;
  data: any[] | null;
  error?: string;   
  executionTimeMs: number;
}

export interface ISqlExecutor {
  runInSandbox(context: ExecutionContext): Promise<RunnerResponse>;
}