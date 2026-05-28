import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { EvaluateSubmissionUseCase } from '../../application/use-cases/evaluate-submission.use-case';
import { EvaluateSubmissionJobDto } from '../../application/dtos/submission-job.dto';

@Processor('submission-queue')
export class SubmissionProcessor extends WorkerHost {
  constructor(
    private readonly _evaluateSubmissionUseCase: EvaluateSubmissionUseCase,
  ) {
    super();
  }

  async process(job: Job<unknown>): Promise<void> {
    const jobData = plainToInstance(EvaluateSubmissionJobDto, job.data);

    try {
      await validateOrReject(jobData);
    } catch (errors) {
      console.error(`[Worker] Estructura del Job inválida para el ID ${job.id}:`, errors);
      throw new Error('El payload del Job no cumple con los requisitos de validación.');
    }

    const { submissionId } = jobData;
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