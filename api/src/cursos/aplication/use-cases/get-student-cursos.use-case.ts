import { Inject } from '@nestjs/common';
import type { Curso } from 'src/cursos/domain/entities/curso.entity';
import type { ICursoRepository } from 'src/cursos/domain/repositories/curso.repository';

export class GetStudentCursosUseCase {
  constructor(@Inject('CURSO_REPOSITORY') private readonly cursoRepository: ICursoRepository) {}

  async execute(studentId: number): Promise<Curso[]> {
    const exists = await this.cursoRepository.studentExists(studentId);
    if (!exists) {
      throw new Error('Estudiante no encontrado');
    }

    return this.cursoRepository.findCoursesByStudentId(studentId);
  }
}
