// src/submissions/application/use-cases/get-submissions-by-challenge.use-case.ts
import { Injectable, Inject } from '@nestjs/common';
import type { ISubmissionRepository } from '../../domain/repositories/submission.repository';
import { Submission } from '../../domain/entities/submission.interface';

@Injectable()
export class GetSubmissionsByChallengeUseCase {
  constructor(
    @Inject('ISubmissionRepository')
    private readonly _submissionRepository: ISubmissionRepository,
  ) {}

  async execute(challengeId: string): Promise<Submission[]> {
    return await this._submissionRepository.findByChallengeId(challengeId);
  }
}