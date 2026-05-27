import type { Reto } from '../entities/challege.entity';

export interface IRetoRepository {
    create(reto: Omit<Reto, 'id' | 'createdAt'>): Promise<Reto>;
    findById(id: string): Promise<Reto | null>;
    findByTitle(title: string): Promise<Reto | null>;
    findAll(filter?: { courseId?: string; difficulty?: 'Easy' | 'Medium' | 'Hard'; status?: 'draft' | 'published' | 'archived' }): Promise<Reto[]>;
    update(id: string, updates: Partial<Omit<Reto, 'id' | 'createdAt'>>): Promise<Reto>;
    delete(id: string): Promise<void>;
}