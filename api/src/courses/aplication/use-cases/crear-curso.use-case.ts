import { Inject } from '@nestjs/common';
import { Course } from "src/courses/domain/entities/course.entity";
import type { ICourseRepository } from "src/courses/domain/repositories/course.repository";

export class CrearCursoUseCase {
    constructor(@Inject('COURSE_REPOSITORY') private readonly courseRepository: ICourseRepository) { }
    async execute(courseData: Omit<Course, 'id' | 'createdAt'>): Promise<Course> {
        // Validar que el código del curso sea único
        const existingCourse = await this.courseRepository.findByCode(courseData.code);
        if (existingCourse) {
            throw new Error('Ya existe un curso con ese código');
        }
        return this.courseRepository.create(courseData);
    }
}