import { Inject } from '@nestjs/common';
import type { ICourseRepository } from 'src/courses/domain/repositories/course.repository';

export class GetCourseStudentsUseCase {
  constructor(@Inject('COURSE_REPOSITORY') private readonly courseRepository: ICourseRepository) {}

  async execute(courseId: string): Promise<Array<{
    id: number;
    email: string;
    role: string;
    createdAt: Date | null;
  }>> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new Error('Curso no encontrado');
    }

    return this.courseRepository.findStudentsByCourseId(courseId);
  }
}
