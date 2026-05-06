import type { Reto } from '../entities/reto.entity';

export interface IRetoRepository {
    create(reto: Omit<Reto, 'id' | 'createdAt'>): Promise<Reto>;
    findById(id: string): Promise<Reto | null>;
    findByTitle(title: string): Promise<Reto | null>;
    findAll(filter?: { courseId?: string; difficulty?: 'Easy' | 'Medium' | 'Hard' }): Promise<Reto[]>;
    update(id: string, updates: Partial<Omit<Reto, 'id' | 'createdAt'>>): Promise<Reto>;
    delete(id: string): Promise<void>;
}