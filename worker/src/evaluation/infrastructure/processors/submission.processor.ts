import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EvaluateSubmissionUseCase } from '../../application/use-cases/evaluate-submission.use-case';

@Processor('submission-queue')
export class SubmissionProcessor extends WorkerHost {
  constructor(
    private readonly _evaluateSubmissionUseCase: EvaluateSubmissionUseCase,
  ) {
    super();
  }

  async process(job: Job<{ submissionId: string }>): Promise<void> {
    const { submissionId } = job.data;

    console.log(`[Worker] Iniciando procesamiento de la submission: ${submissionId}`);

    try {
      await this._evaluateSubmissionUseCase.execute(submissionId);
      
      console.log(`[Worker] Finalizado con éxito: ${submissionId}`);
        } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error(`[Worker] Falló la evaluación de ${submissionId}:`, errorMessage);
        throw error; 
        }
  }
}