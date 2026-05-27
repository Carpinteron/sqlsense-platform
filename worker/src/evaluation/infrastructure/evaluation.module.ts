import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { SubmissionProcessor } from './processors/submission.processor';
import { EvaluateSubmissionUseCase } from '../application/use-cases/evaluate-submission.use-case';
import { SqlExecutorPostgres } from './external/sql-executor.postgres';
import { PrismaSubmissionRepository } from './persistence/prisma-submission.repository';
import { PrismaModule } from '../../shared/infrastructure/prisma/pisma.module';
import { AiEvaluationModule } from '../../ai-evaluation/ai-evaluation.module';
import { AiEvaluationAdapter } from '../../ai-evaluation/infrastructure/ai-evaluation.adapter';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get('REDIS_HOST', 'redis'),
          port: 6379,
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'submission-queue',
    }),
    PrismaModule,
    AiEvaluationModule,
  ],
  providers: [
    SubmissionProcessor,
    EvaluateSubmissionUseCase,
    {
      provide: 'ISubmissionRepository',
      useClass: PrismaSubmissionRepository,
    },
    {
      provide: 'ISqlExecutor',
      useClass: SqlExecutorPostgres,
    },
    {
      provide: 'IAIAssistant',
      useExisting: AiEvaluationAdapter,
    },
  ],
})
export class EvaluationModule {}