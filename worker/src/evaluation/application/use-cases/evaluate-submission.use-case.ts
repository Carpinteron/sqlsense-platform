import type { ISubmissionRepository } from '../../domain/interfaces/submission-repository.interface';
import type { ISqlExecutor } from '../../domain/interfaces/sql-executor.interface';
import type { IAIAssistant } from '../../domain/interfaces/ai-assistant.interface';
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class EvaluateSubmissionUseCase {
  constructor(
    @Inject('ISubmissionRepository')
    private readonly _submissionRepository: ISubmissionRepository,
    @Inject('ISqlExecutor')
    private readonly _sqlExecutor: ISqlExecutor,
    @Inject('IAIAssistant')
    private readonly _aiAssistant: IAIAssistant,
  ) {}

  async execute(submissionId: string): Promise<void> {
    // 1. Obtener la entidad 
    const evaluation = await this._submissionRepository.findById(submissionId);
    
    // 2. Obtener info del reto 
    const challengeData = await this._submissionRepository.getChallengeContext(evaluation.challengeId);

    try {
      // 3. Ejecutar en el Runner
      const runnerResult = await this._sqlExecutor.runInSandbox({
        schema: challengeData.schema_sql,
        seed: challengeData.seed_data_sql,
        studentQuery: evaluation.query
      });

      // 4. Obtener evaluación 
      const aiResult = await this._aiAssistant.evaluate(
        evaluation.query,
        challengeData.expected_result,
        runnerResult.data,
        runnerResult.error
      );

      // 5. Obtener tips de optimización 
      let tips = '';
      if (runnerResult.success) {
        tips = await this._aiAssistant.getOptimizationTips(evaluation.query, runnerResult.executionTimeMs);
      }

      // 6. Actualizar la entidad con toda la info recolectada
      evaluation.applyResults({
        status: runnerResult.success ? (aiResult.score >= 3 ? 'ACCEPTED' : 'WRONG_ANSWER') : 'SYNTAX_ERROR',
        executionTimeMs: runnerResult.executionTimeMs,
        score: aiResult.score,
        result: runnerResult.data,
        feedback: `${aiResult.feedback}\n\n${tips}`
      });

    } catch (error) {
      evaluation.applyResults({
        status: 'RUNTIME_ERROR',
        executionTimeMs: 0,
        score: 0,
        result: null,
        feedback: 'Ocurrió un error inesperado en el sistema de evaluación.'
      });
    }

    // 7. Persistir cambios en db
    await this._submissionRepository.update(evaluation);
  }
}