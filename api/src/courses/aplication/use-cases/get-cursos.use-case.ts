import { Inject } from '@nestjs/common';
import type { ICourseRepository} from "src/courses/domain/repositories/course.repository";
import { Course } from 'src/courses/domain/entities/course.entity';

export class GetCoursesUseCase {
    constructor(@Inject('COURSE_REPOSITORY') private readonly courseRepository: ICourseRepository) { }
    
    async execute(filter?: { professorId?: number; period?: string }): Promise<Course[]> {
        return this.courseRepository.findAll(filter);
    }
}
