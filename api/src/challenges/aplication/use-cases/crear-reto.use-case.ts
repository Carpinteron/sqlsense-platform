import { Inject } from "@nestjs/common";
import { Reto } from "src/challenges/domain/entities/reto.entity";
import type { IRetoRepository } from "src/challenges/domain/repositories/reto.repository";

export class CrearRetoUseCase {
    constructor(@Inject('RETO_REPOSITORY') private readonly retoRepository: IRetoRepository) { }
    async execute(retoData: Omit<Reto, 'id' | 'createdAt'>): Promise<Reto> {
        return this.retoRepository.create(retoData);
    }
}   