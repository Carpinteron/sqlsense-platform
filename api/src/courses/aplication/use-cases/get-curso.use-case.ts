import { Inject } from '@nestjs/common';
import { Course } from "src/courses/domain/entities/course.entity";
import type { ICourseRepository } from "src/courses/domain/repositories/course.repository";

export class GetCourseUseCase {
    constructor(@Inject('COURSE_REPOSITORY') private readonly courseRepository: ICourseRepository) { }
    
    async execute(id: string): Promise<Course> {
        const course = await this.courseRepository.findById(id);
        if (!course) {
            throw new Error('Curso no encontrado');
        }
        return course;
    }
}
