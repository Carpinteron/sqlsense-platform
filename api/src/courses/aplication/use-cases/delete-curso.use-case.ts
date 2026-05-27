import { Inject } from '@nestjs/common';
import type { ICourseRepository } from "src/courses/domain/repositories/course.repository";

export class DeleteCourseUseCase {
    constructor(@Inject('COURSE_REPOSITORY') private readonly courseRepository: ICourseRepository) { }
    
    async execute(id: string): Promise<void> {
        // Validar que el curso exista antes de eliminar
        const course = await this.courseRepository.findById(id);
        if (!course) {
            throw new Error('Curso no encontrado');
        }
        
        return this.courseRepository.delete(id);
    }
}
