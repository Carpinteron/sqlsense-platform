import { Curso } from "src/cursos/domain/entities/curso.entity";
import { ICursoRepository } from "src/cursos/domain/repositories/curso.repository";

export class CrearCursoUseCase {
    constructor(private readonly cursoRepository: ICursoRepository) { }
    async execute(courseData: Omit<Curso, 'id' | 'createdAt'>): Promise<Curso> {
        // Validar que el código del curso sea único
        const existingCourse = await this.cursoRepository.findByCode(courseData.code);
        if (existingCourse) {
            throw new Error('Ya existe un curso con ese código');
        }
        return this.cursoRepository.create(courseData);
    }
}