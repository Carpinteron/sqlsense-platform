import { Curso } from "src/cursos/domain/entities/curso.entity";
import { ICursoRepository } from "src/cursos/domain/repositories/curso.repository";

export class GetCursoUseCase {
    constructor(private readonly cursoRepository: ICursoRepository) { }
    
    async execute(id: string): Promise<Curso> {
        const curso = await this.cursoRepository.findById(id);
        if (!curso) {
            throw new Error('Curso no encontrado');
        }
        return curso;
    }
}
