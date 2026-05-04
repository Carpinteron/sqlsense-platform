import { Inject } from '@nestjs/common';
import { Curso } from "src/cursos/domain/entities/curso.entity";
import type { ICursoRepository } from "src/cursos/domain/repositories/curso.repository";

export class GetCursosUseCase {
    constructor(@Inject('CURSO_REPOSITORY') private readonly cursoRepository: ICursoRepository) { }
    
    async execute(filter?: { professorId?: number; period?: string }): Promise<Curso[]> {
        return this.cursoRepository.findAll(filter);
    }
}
