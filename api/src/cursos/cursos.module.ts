import { Module } from '@nestjs/common';
import { PrismaModule } from '../shared/infrastructure/prisma/prisma.module';
import { CURSO_REPOSITORY } from './aplication/token';
import { CursoRepository } from './infrastructure/persistance/postgres-curso.repository';
import { CrearCursoUseCase } from './aplication/use-cases/crear-curso.use-case';
import { GetCursosUseCase } from './aplication/use-cases/get-cursos.use-case';
import { GetCursoUseCase } from './aplication/use-cases/get-curso.use-case';
import { UpdateCursoUseCase } from './aplication/use-cases/update-curso.use-case';
import { DeleteCursoUseCase } from './aplication/use-cases/delete-curso.use-case';
import { CursosController } from './infrastructure/controllers/cursos.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CursosController],
  providers: [
    {
      provide: CURSO_REPOSITORY,
      useClass: CursoRepository,
    },
    CrearCursoUseCase,
    GetCursosUseCase,
    GetCursoUseCase,
    UpdateCursoUseCase,
    DeleteCursoUseCase,
  ],
  exports: [CURSO_REPOSITORY],
})
export class CursosModule {}