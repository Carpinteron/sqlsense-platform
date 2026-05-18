import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { ISubmissionRepository, ChallengeContext } from '../../domain/interfaces/submission-repository.interface';
import { Evaluation, SubmissionStatus } from '../../domain/entities/evaluation.entity';

@Injectable()
export class PrismaSubmissionRepository implements ISubmissionRepository {
  constructor(private readonly _prisma: PrismaService) {}

  async findById(id: string): Promise<Evaluation> {
    const row = await this._prisma.submissions.findUnique({
      where: { id },
    });

    if (!row) {
      throw new NotFoundException(`La evaluación con ID ${id} no existe.`);
    }

    return new Evaluation(
      row.id,
      row.student_id ? String(row.student_id) : '', 
      row.challenge_id ?? '',
      row.query,
      (row.status as SubmissionStatus) ?? 'QUEUED',
      row.execution_time_ms ?? 0,
      row.score ?? 0,
      row.result ?? null,
      row.feedback ?? ''
    );
  }

  async getChallengeContext(challengeId: string): Promise<ChallengeContext> {
    const challenge = await this._prisma.challenges.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      throw new NotFoundException(`El reto con ID ${challengeId} no fue encontrado.`);
    }

    return {
      schema_sql: challenge.schema_sql ?? '',     
      seed_data_sql: challenge.seed_data_sql ?? '', 
      expected_result: challenge.expected_result ?? null, 
    };
  }

async update(evaluation: Evaluation): Promise<void> {
    try {
      await this._prisma.submissions.update({
        where: { id: evaluation.id },
        data: {
          status: evaluation.status,
          execution_time_ms: evaluation.executionTimeMs,
          score: evaluation.score,
          result: evaluation.resultJson,
          feedback: evaluation.feedback,
        },
      });
    } catch (error) {
      throw new NotFoundException(`La evaluación con ID ${evaluation.id} no existe.`);
    }
  }
}