import type { Challenge } from '../entities/challege.entity';

export interface IChallengeRepository {
    create(challenge: Omit<Challenge, 'id' | 'createdAt'>): Promise<Challenge>;
    findById(id: string): Promise<Challenge | null>;
    findByTitle(title: string): Promise<Challenge | null>;
    findAll(filter?: { courseId?: string; difficulty?: 'Easy' | 'Medium' | 'Hard'; status?: 'draft' | 'published' | 'archived' }): Promise<Challenge[]>;
    update(id: string, updates: Partial<Omit<Challenge, 'id' | 'createdAt'>>): Promise<Challenge>;
    delete(id: string): Promise<void>;
}