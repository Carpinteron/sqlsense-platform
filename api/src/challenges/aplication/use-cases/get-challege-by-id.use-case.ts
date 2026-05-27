import { Inject } from '@nestjs/common';
import { Reto } from "src/challenges/domain/entities/challege.entity";
import type { IRetoRepository } from "src/challenges/domain/repositories/challege.repository";

export class GetRetoByIdUseCase {
    constructor(@Inject('RETO_REPOSITORY') private readonly retoRepository: IRetoRepository) { }
    
    async execute(id: string): Promise<Reto> {
        const reto = await this.retoRepository.findById(id);
        if (!reto) {
            throw new Error('Reto not found');
        }
        return reto;
    }   
}   