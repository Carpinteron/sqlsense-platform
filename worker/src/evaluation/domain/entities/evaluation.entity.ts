export type SubmissionStatus = 
  | 'QUEUED' | 'RUNNING' | 'ACCEPTED' 
  | 'WRONG_ANSWER' | 'SYNTAX_ERROR' 
  | 'TIME_LIMIT_EXCEEDED' | 'RUNTIME_ERROR'
  | 'OPTIMIZATION_REQUIRED';

export class Evaluation {
  constructor(
    public readonly id: string,         
    public readonly studentId: string, 
    public readonly challengeId: string,
    public readonly query: string,     
    private _status: SubmissionStatus = 'QUEUED',
    private _executionTimeMs: number = 0,
    private _score: number = 0,
    private _resultJson: any = null,
    private _feedback: string = ''
  ) {}

  get status() { return this._status; }
  get executionTimeMs() { return this._executionTimeMs; }
  get score() { return this._score; }
  get resultJson() { return this._resultJson; }
  get feedback() { return this._feedback; }

  applyResults(params: {
    status: SubmissionStatus;
    executionTimeMs: number;
    score: number;
    result: any;
    feedback: string;
  }) {
    this._status = params.status;
    this._executionTimeMs = params.executionTimeMs;
    this._score = params.score;
    this._resultJson = params.result;
    this._feedback = params.feedback;
  }

}