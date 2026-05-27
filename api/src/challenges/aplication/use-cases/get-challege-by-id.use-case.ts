import { Inject } from '@nestjs/common';
import { Challenge } from "src/challenges/domain/entities/challege.entity";
import type { IChallengeRepository } from "src/challenges/domain/repositories/challege.repository";

export class GetChallengeByIdUseCase {
    constructor(@Inject('CHALLENGE_REPOSITORY') private readonly challengeRepository: IChallengeRepository) { }
    
    async execute(id: string): Promise<Challenge> {
        const challenge = await this.challengeRepository.findById(id);
        if (!challenge) {
            throw new Error('Challenge not found');
        }
        return challenge;
    }   
}   