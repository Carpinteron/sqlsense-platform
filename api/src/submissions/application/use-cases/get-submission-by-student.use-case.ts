import { Injectable, Inject } from '@nestjs/common';
import type { ISubmissionRepository } from '../../domain/repositories/submission.repository';
import { Submission } from '../../domain/entities/submission.interface';

@Injectable()
export class GetSubmissionsByStudentUseCase {
  constructor(
    @Inject('ISubmissionRepository')
    private readonly _submissionRepository: ISubmissionRepository,
  ) {}

  async execute(studentId: number): Promise<Submission[]> {
    return await this._submissionRepository.findByStudentId(studentId);
  }
}