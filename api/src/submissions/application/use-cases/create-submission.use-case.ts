import { Injectable, Inject } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import type { ISubmissionRepository } from '../../domain/repositories/submission.repository';
import { CreateSubmissionDto } from '../dtos/create-submission.dto';
import { SubmissionCreatedResponseDto } from '../dtos/submission-created-response.dto';

@Injectable()
export class CreateSubmissionUseCase {
  constructor(
    @Inject('ISubmissionRepository')
    private readonly _submissionRepository: ISubmissionRepository,
    
    @InjectQueue('submission-queue')
    private readonly _submissionQueue: Queue,
  ) {}

  async execute(
    dto: CreateSubmissionDto, 
    studentId: number
  ): Promise<SubmissionCreatedResponseDto> {
    
    const newSubmission = {
      studentId: studentId,
      challengeId: dto.challengeId,
      query: dto.query,
      status: 'QUEUED' as const,
    };

    const savedSubmission = await this._submissionRepository.create(newSubmission);

    await this._submissionQueue.add(
      'evaluate', 
      { submissionId: savedSubmission.id },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 }
      }
    );

    return {
      id: savedSubmission.id,
      status: savedSubmission.status,
      message: 'La entrega ha sido registrada con éxito y se encuentra en cola de evaluación.',
    };
  }
}