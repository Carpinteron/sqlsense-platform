import { Module } from '@nestjs/common';
import { CURSO_REPOSITORY } from './aplication/token';
import { CursoRepository } from './infrastructure/persistance/postgres-curso.repository';

@Module({
  providers: [
    {
      provide: CURSO_REPOSITORY,
      useClass: CursoRepository,
    },
  ],
  exports: [CURSO_REPOSITORY],
})
export class CursosModule {}