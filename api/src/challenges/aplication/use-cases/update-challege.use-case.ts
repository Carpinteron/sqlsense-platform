import { Inject } from '@nestjs/common';
import { Reto } from "src/challenges/domain/entities/challege.entity";
import type { IRetoRepository } from "src/challenges/domain/repositories/challege.repository";

export class UpdateRetoUseCase {
    constructor(@Inject('RETO_REPOSITORY') private readonly retoRepository: IRetoRepository) { }
    
    async execute(id: string, updates: Partial<Omit<Reto, 'id' | 'createdAt'>>): Promise<Reto> {
        // Validar que el reto exista
        const existingReto = await this.retoRepository.findById(id);
        if (!existingReto) {
            throw new Error('Reto no encontrado');
        }
        
        // Si se intenta actualizar el título, validar que sea único
        if (updates.title && updates.title !== existingReto.title) {
            const retoWithTitle = await this.retoRepository.findByTitle(updates.title);
            if (retoWithTitle) {
                throw new Error('Ya existe un reto con ese título');
            }
        }
        
        return this.retoRepository.update(id, updates);
    }
}   