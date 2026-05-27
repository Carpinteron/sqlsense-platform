import { Inject } from "@nestjs/common";   
import { Reto } from "src/challenges/domain/entities/challege.entity";
import type { IRetoRepository } from "src/challenges/domain/repositories/challege.repository";

export class GetRetoByTitleUseCase {
    constructor(@Inject('RETO_REPOSITORY') private readonly retoRepository: IRetoRepository) { }
    
    async execute(title: string): Promise<Reto> {
        const reto = await this.retoRepository.findByTitle(title);
        if (!reto) {
            throw new Error('Reto no encontrado');
        }
        return reto;
    }
}