import { Inject } from "@nestjs/common";   
import { Challenge } from "src/challenges/domain/entities/challege.entity";
import type { IChallengeRepository } from "src/challenges/domain/repositories/challege.repository";

export class GetChallengeByTitleUseCase {
    constructor(@Inject('CHALLENGE_REPOSITORY') private readonly challengeRepository: IChallengeRepository) { }
    
    async execute(title: string): Promise<Challenge> {
        const challenge = await this.challengeRepository.findByTitle(title);
        if (!challenge) {
            throw new Error('Challenge not found');
        }
        return challenge;
    }
}