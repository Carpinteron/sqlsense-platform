import { Inject } from '@nestjs/common';
import { Course } from "src/courses/domain/entities/course.entity";
import type { ICourseRepository } from "src/courses/domain/repositories/course.repository";

export class UpdateCourseUseCase {
    constructor(@Inject('COURSE_REPOSITORY') private readonly courseRepository: ICourseRepository) { }
    
    async execute(id: string, updates: Partial<Omit<Course, 'id' | 'createdAt'>>): Promise<Course> {
        // Validar que el curso exista
        const existingCourse = await this.courseRepository.findById(id);
        if (!existingCourse) {
            throw new Error('Curso no encontrado');
        }
        
        // Si se intenta actualizar el código, validar que sea único
        if (updates.code && updates.code !== existingCourse.code) {
            const courseWithCode = await this.courseRepository.findByCode(updates.code);
            if (courseWithCode) {
                throw new Error('Ya existe un curso con ese código');
            }
        }
        
        return this.courseRepository.update(id, updates);
    }
}
