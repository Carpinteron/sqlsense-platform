import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ISubmissionRepository } from '../../domain/repositories/submission.repository';
import { Submission } from '../../domain/entities/submission.interface';

@Injectable()
export class GetSubmissionByIdUseCase {
  constructor(
    @Inject('ISubmissionRepository')
    private readonly _submissionRepository: ISubmissionRepository,
  ) {}

  async execute(id: string): Promise<Submission> {
    const submission = await this._submissionRepository.findById(id);
    
    if (!submission) {
      throw new NotFoundException(`La entrega con ID ${id} no existe.`);
    }

    return submission;
  }
}