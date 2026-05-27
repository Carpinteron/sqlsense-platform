import { Inject } from "@nestjs/common";
import { Challenge } from "src/challenges/domain/entities/challege.entity";
import type { IChallengeRepository } from "src/challenges/domain/repositories/challege.repository";

export class DeleteChallengeUseCase {
    constructor(@Inject('CHALLENGE_REPOSITORY') private readonly challengeRepository: IChallengeRepository) { }
    
    async execute(id: string): Promise<void> {
        // Validar que el reto exista antes de eliminar
        const challenge = await this.challengeRepository.findById(id);
        if (!challenge) {
            throw new Error('Reto no encontrado');
        }
        
        return this.challengeRepository.delete(id);
    }
}