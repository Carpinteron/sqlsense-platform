import { Inject } from '@nestjs/common';
import type { ICursoRepository } from "src/cursos/domain/repositories/curso.repository";

export class DeleteCursoUseCase {
    constructor(@Inject('CURSO_REPOSITORY') private readonly cursoRepository: ICursoRepository) { }
    
    async execute(id: string): Promise<void> {
        // Validar que el curso exista antes de eliminar
        const curso = await this.cursoRepository.findById(id);
        if (!curso) {
            throw new Error('Curso no encontrado');
        }
        
        return this.cursoRepository.delete(id);
    }
}
