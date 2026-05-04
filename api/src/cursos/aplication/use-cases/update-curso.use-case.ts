import { Inject } from '@nestjs/common';
import { Curso } from "src/cursos/domain/entities/curso.entity";
import type { ICursoRepository } from "src/cursos/domain/repositories/curso.repository";

export class UpdateCursoUseCase {
    constructor(@Inject('CURSO_REPOSITORY') private readonly cursoRepository: ICursoRepository) { }
    
    async execute(id: string, updates: Partial<Omit<Curso, 'id' | 'createdAt'>>): Promise<Curso> {
        // Validar que el curso exista
        const existingCurso = await this.cursoRepository.findById(id);
        if (!existingCurso) {
            throw new Error('Curso no encontrado');
        }
        
        // Si se intenta actualizar el código, validar que sea único
        if (updates.code && updates.code !== existingCurso.code) {
            const courseWithCode = await this.cursoRepository.findByCode(updates.code);
            if (courseWithCode) {
                throw new Error('Ya existe un curso con ese código');
            }
        }
        
        return this.cursoRepository.update(id, updates);
    }
}
