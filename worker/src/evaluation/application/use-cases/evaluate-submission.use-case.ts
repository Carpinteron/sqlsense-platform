import type { ISubmissionRepository } from '../../domain/interfaces/submission-repository.interface';
import type { ISqlExecutor } from '../../domain/interfaces/sql-executor.interface';
import type { IAIAssistant } from '../../domain/interfaces/ai-assistant.interface';
import { Injectable, Inject } from '@nestjs/common';
import { Evaluation } from '../../domain/entities/evaluation.entity';

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
    // 1. Obtener la entidad y actualizar inmediatamente a RUNNING
    const evaluation = await this._submissionRepository.findById(submissionId);
    
    evaluation.applyResults({
      status: 'RUNNING',
      executionTimeMs: 0,
      score: 0,
      result: null,
      feedback: 'La entrega se está procesando actualmente...'
    });
    await this._submissionRepository.update(evaluation);
    
    // 2. Obtener info del reto 
    const challengeData = await this._submissionRepository.getChallengeContext(evaluation.challengeId);

    try {
      // 3. Ejecutar en el Runner
      const runnerResult = await this._sqlExecutor.runInSandbox({
        schema: challengeData.schema_sql,
        seed: challengeData.seed_data_sql,
        studentQuery: evaluation.query,
        challengeId: evaluation.challengeId
      });

      // Rrrores del Runner (timeout, sintaxis, runtime)
      if (runnerResult.status === 'TIME_LIMIT_EXCEEDED') {
        evaluation.applyResults({
          status: 'TIME_LIMIT_EXCEEDED',
          executionTimeMs: runnerResult.executionTimeMs,
          score: 0,
          result: null,
          feedback: 'Tu consulta excedió el tiempo límite de ejecución configurado.'
        });
        return; 
      }

      if (runnerResult.status === 'SYNTAX_ERROR') {
        evaluation.applyResults({
          status: 'SYNTAX_ERROR',
          executionTimeMs: runnerResult.executionTimeMs,
          score: 0,
          result: null,
          feedback: `Error de sintaxis SQL:\n${runnerResult.error}`
        });
        return;
      }

      if (runnerResult.status === 'RUNTIME_ERROR') {
        evaluation.applyResults({
          status: 'RUNTIME_ERROR',
          executionTimeMs: runnerResult.executionTimeMs,
          score: 0,
          result: null,
          feedback: `Error de ejecución (Runtime) en la base de datos:\n${runnerResult.error}`
        });
        return;
      }

      const aiResult = await this._aiAssistant.evaluate(
        evaluation.query,
        challengeData.expected_result,
        runnerResult.data,
        undefined
      );

      let tips = '';
      if (aiResult.requiresOptimization) {
        tips = await this._aiAssistant.getOptimizationTips(evaluation.query, runnerResult.executionTimeMs);
      }

      // 6. Determinar el estado final 
      const finalStatus = Evaluation.determineFinalStatus(aiResult.score, aiResult.requiresOptimization);

      evaluation.applyResults({
        status: finalStatus,
        executionTimeMs: runnerResult.executionTimeMs,
        score: aiResult.score,
        result: runnerResult.data,
        feedback: tips ? `${aiResult.feedback}\n\n${tips}` : aiResult.feedback
      });

    } catch (error: any) {
      evaluation.applyResults({
        status: 'RUNTIME_ERROR',
        executionTimeMs: 0,
        score: 0,
        result: null,
        feedback: `Ocurrió un error inesperado en el sistema de evaluación externo: ${error.message || error}`
      });
    } finally {
      await this._submissionRepository.update(evaluation);
    }
  }
}