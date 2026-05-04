import { Inject } from '@nestjs/common';
import { Curso } from "src/cursos/domain/entities/curso.entity";
import type { ICursoRepository } from "src/cursos/domain/repositories/curso.repository";

export class GetCursoUseCase {
    constructor(@Inject('CURSO_REPOSITORY') private readonly cursoRepository: ICursoRepository) { }
    
    async execute(id: string): Promise<Curso> {
        const curso = await this.cursoRepository.findById(id);
        if (!curso) {
            throw new Error('Curso no encontrado');
        }
        return curso;
    }
}
