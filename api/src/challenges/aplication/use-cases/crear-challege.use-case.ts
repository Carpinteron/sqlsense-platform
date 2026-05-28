import { Inject } from "@nestjs/common";
import { Challenge } from "src/challenges/domain/entities/challege.entity";
import type { IChallengeRepository } from "src/challenges/domain/repositories/challege.repository";

export class CrearChallengeUseCase {
    constructor(@Inject('CHALLENGE_REPOSITORY') private readonly challengeRepository: IChallengeRepository) { }
    async execute(challengeData: Omit<Challenge, 'id' | 'createdAt'>): Promise<Challenge> {
        return this.challengeRepository.create(challengeData);
    }
}   