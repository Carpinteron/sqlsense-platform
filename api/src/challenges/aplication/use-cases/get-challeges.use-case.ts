import { Inject } from '@nestjs/common';
import { Reto } from "src/challenges/domain/entities/challege.entity";
import type { IRetoRepository } from "src/challenges/domain/repositories/challege.repository";

export class GetRetosUseCase {
    constructor(@Inject('RETO_REPOSITORY') private readonly retoRepository: IRetoRepository) { }

    async execute(filter?: { courseId?: string; difficulty?: 'Easy' | 'Medium' | 'Hard'; status?: 'draft' | 'published' | 'archived' }): Promise<Reto[]> {
        return this.retoRepository.findAll(filter);
    }
}