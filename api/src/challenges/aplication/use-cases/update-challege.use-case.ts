import { Inject } from '@nestjs/common';
import { Challenge } from "src/challenges/domain/entities/challege.entity";
import type { IChallengeRepository } from "src/challenges/domain/repositories/challege.repository";

export class UpdateChallengeUseCase {
    constructor(@Inject('CHALLENGE_REPOSITORY') private readonly challengeRepository: IChallengeRepository) { }
    
    async execute(id: string, updates: Partial<Omit<Challenge, 'id' | 'createdAt'>>): Promise<Challenge > {
        // Validar que el reto exista
        const existingChallenge = await this.challengeRepository.findById(id);
        if (!existingChallenge) {
            throw new Error('Reto no encontrado');
        }
        
        // Si se intenta actualizar el título, validar que sea único
        if (updates.title && updates.title !== existingChallenge.title) {
            const challengeWithTitle = await this.challengeRepository.findByTitle(updates.title);
            if (challengeWithTitle) {
                throw new Error('Ya existe un reto con ese título');
            }
        }
        
        return this.challengeRepository.update(id, updates);
    }
}   