import { Inject } from "@nestjs/common";
import { Reto } from "src/challenges/domain/entities/challege.entity";
import type { IRetoRepository } from "src/challenges/domain/repositories/challege.repository";

export class CrearRetoUseCase {
    constructor(@Inject('RETO_REPOSITORY') private readonly retoRepository: IRetoRepository) { }
    async execute(retoData: Omit<Reto, 'id' | 'createdAt'>): Promise<Reto> {
        return this.retoRepository.create(retoData);
    }
}   