import { Inject } from '@nestjs/common';
import { Challenge } from "src/challenges/domain/entities/challege.entity";
import type { IChallengeRepository } from "src/challenges/domain/repositories/challege.repository";

export class GetChallengesUseCase {
    constructor(@Inject('CHALLENGE_REPOSITORY') private readonly challengeRepository: IChallengeRepository) { }

    async execute(filter?: { courseId?: string; difficulty?: 'Easy' | 'Medium' | 'Hard'; status?: 'draft' | 'published' | 'archived' }): Promise<Challenge[]> {
        return this.challengeRepository.findAll(filter);
    }
}