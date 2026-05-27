import { Inject } from '@nestjs/common';
import type { Course } from 'src/courses/domain/entities/course.entity';
import type { ICourseRepository } from 'src/courses/domain/repositories/course.repository';

export class GetStudentCursosUseCase {
  constructor(@Inject('COURSE_REPOSITORY') private readonly courseRepository: ICourseRepository) {}

  async execute(studentId: number): Promise<Course[]> {
    const exists = await this.courseRepository.studentExists(studentId);
    if (!exists) {
      throw new Error('Estudiante no encontrado');
    }

    return this.courseRepository.findCoursesByStudentId(studentId);
  }
}
