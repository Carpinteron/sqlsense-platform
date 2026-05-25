import { Inject } from '@nestjs/common';
import type { ICursoRepository } from 'src/cursos/domain/repositories/curso.repository';

export class AddStudentToCursoUseCase {
  constructor(@Inject('CURSO_REPOSITORY') private readonly cursoRepository: ICursoRepository) {}

  async execute(courseId: string, studentId: number): Promise<void> {
    // Validate course exists
    const curso = await this.cursoRepository.findById(courseId);
    if (!curso) {
      throw new Error('Curso no encontrado');
    }

    // Delegate to repository to create the association
    return this.cursoRepository.addStudent(courseId, studentId);
  }
}
