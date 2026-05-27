import { Inject } from "@nestjs/common";
import { Reto } from "src/challenges/domain/entities/challege.entity";
import type { IRetoRepository } from "src/challenges/domain/repositories/challege.repository";

export class DeleteRetoUseCase {
    constructor(@Inject('RETO_REPOSITORY') private readonly retoRepository: IRetoRepository) { }
    
    async execute(id: string): Promise<void> {
        // Validar que el reto exista antes de eliminar
        const reto = await this.retoRepository.findById(id);
        if (!reto) {
            throw new Error('Reto no encontrado');
        }
        
        return this.retoRepository.delete(id);
    }
}