import { Curso } from "src/cursos/domain/entities/curso.entity";
import { ICursoRepository } from "src/cursos/domain/repositories/curso.repository";

export class GetCursosUseCase {
    constructor(private readonly cursoRepository: ICursoRepository) { }
    
    async execute(filter?: { professorId?: string; period?: string }): Promise<Curso[]> {
        return this.cursoRepository.findAll(filter);
    }
}
