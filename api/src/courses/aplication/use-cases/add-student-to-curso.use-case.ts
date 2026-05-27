import { Inject } from '@nestjs/common';
import type { ICourseRepository } from 'src/courses/domain/repositories/course.repository';

export class AddStudentToCourseUseCase {
  constructor(@Inject('COURSE_REPOSITORY') private readonly courseRepository: ICourseRepository) {}

  async execute(courseId: string, studentId: number): Promise<void> {
    // Validate course exists
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new Error('Curso no encontrado');
    }

    // Delegate to repository to create the association
    return this.courseRepository.addStudent(courseId, studentId);
  }
}
  