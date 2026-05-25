import { Inject } from '@nestjs/common';
import type { ICursoRepository } from 'src/cursos/domain/repositories/curso.repository';

export class GetCourseStudentsUseCase {
  constructor(@Inject('CURSO_REPOSITORY') private readonly cursoRepository: ICursoRepository) {}

  async execute(courseId: string): Promise<Array<{
    id: number;
    email: string;
    role: string;
    createdAt: Date | null;
  }>> {
    const course = await this.cursoRepository.findById(courseId);
    if (!course) {
      throw new Error('Curso no encontrado');
    }

    return this.cursoRepository.findStudentsByCourseId(courseId);
  }
}
