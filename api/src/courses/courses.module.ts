import { Module } from '@nestjs/common';
import { PrismaModule } from '../shared/infrastructure/prisma/prisma.module';
import { CourseRepository } from './infrastructure/persistance/postgres-course.repository';
import { CrearCursoUseCase } from './aplication/use-cases/crear-curso.use-case';
import { GetCoursesUseCase } from './aplication/use-cases/get-cursos.use-case';
import { GetCourseUseCase } from './aplication/use-cases/get-curso.use-case';
import { UpdateCourseUseCase } from './aplication/use-cases/update-curso.use-case';
import { DeleteCourseUseCase } from './aplication/use-cases/delete-curso.use-case';
import { AddStudentToCourseUseCase } from './aplication/use-cases/add-student-to-curso.use-case';
import { GetCourseStudentsUseCase } from './aplication/use-cases/get-course-students.use-case';
import { GetStudentCursosUseCase } from './aplication/use-cases/get-student-cursos.use-case';
import { CursosController } from './infrastructure/controllers/course.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CursosController],
  providers: [
    {
      provide: "COURSE_REPOSITORY",
      useClass: CourseRepository,
    },
    CrearCursoUseCase,
    GetCoursesUseCase,
    GetCourseUseCase,
    UpdateCourseUseCase,
    DeleteCourseUseCase,
    AddStudentToCourseUseCase,
    GetCourseStudentsUseCase,
    GetStudentCursosUseCase,
  ],
  exports: ["COURSE_REPOSITORY"],
})
export class CursosModule {}