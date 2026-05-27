import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config'; 
import { PrismaModule } from '../shared/infrastructure/prisma/prisma.module';

import { CreateSubmissionUseCase } from './application/use-cases/create-submission.use-case';
import { GetSubmissionByIdUseCase } from './application/use-cases/get-submission-by-id.use-case';
import { GetSubmissionsByStudentUseCase } from './application/use-cases/get-submission-by-student.use-case';
import { GetSubmissionsByChallengeUseCase } from './application/use-cases/get-submission-by-challenge.use-case';
import { GetChallengeReportUseCase } from './application/use-cases/get-challenge-report.use-case';

import { SubmissionsController } from './infrastructure/controllers/submissions.controller';
import { PostgresSubmissionRepository } from './infrastructure/repositories/postgres-submission.repository';

import { GetStudentReportUseCase } from './application/use-cases/get-student-report.use-case';

import { CursosModule } from '../cursos/cursos.module';
import { RetoModule } from '../challenges/reto.module';
import { GetCourseReportUseCase } from './application/use-cases/get-course-report.use-case';

@Module({
  imports: [
    PrismaModule,
    CursosModule,  
    RetoModule,

    BullModule.forRootAsync({
      inject: [ConfigService], 
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST', 'sql_sense_redis'), 
          port: config.get<number>('REDIS_PORT', 6379),
        },
      }),
    }),
    
    BullModule.registerQueue({
      name: 'submission-queue',
    }),
  ],
  controllers: [
    SubmissionsController
  ],
  providers: [
    CreateSubmissionUseCase,
    GetSubmissionByIdUseCase,
    GetSubmissionsByStudentUseCase,
    GetSubmissionsByChallengeUseCase,
    GetChallengeReportUseCase,
    GetStudentReportUseCase,
    GetCourseReportUseCase,
    {
      provide: 'ISubmissionRepository',
      useClass: PostgresSubmissionRepository, 
    },
  ],
})
export class SubmissionsModule {}