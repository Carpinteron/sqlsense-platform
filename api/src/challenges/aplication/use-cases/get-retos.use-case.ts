import { Inject } from '@nestjs/common';
import { Reto } from "src/challenges/domain/entities/reto.entity";
import type { IRetoRepository } from "src/challenges/domain/repositories/reto.repository";

export class GetRetosUseCase {
    constructor(@Inject('RETO_REPOSITORY') private readonly retoRepository: IRetoRepository) { }

    async execute(filter?: { courseId?: string; difficulty?: 'Easy' | 'Medium' | 'Hard'; status?: 'draft' | 'published' | 'archived' }): Promise<Reto[]> {
        return this.retoRepository.findAll(filter);
    }
}