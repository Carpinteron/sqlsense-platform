import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { SubmissionProcessor } from './processors/submission.processor';
import { EvaluateSubmissionUseCase } from '../application/use-cases/evaluate-submission.use-case';
import { ISubmissionRepository } from '../domain/interfaces/submission-repository.interface';
import { ISqlExecutor } from '../domain/interfaces/sql-executor.interface';
import { IAIAssistant } from '../domain/interfaces/ai-assistant.interface';
import { SqlExecutorStub } from './external/sql-executor.stub';
import { AIAssistantStub } from './external/ai-assistant.stub';
import { SubmissionRepositoryMock } from './persistence/submission-repository.mock';

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
],
    providers: [
    SubmissionProcessor,
    EvaluateSubmissionUseCase,
    {
      provide: 'ISubmissionRepository',
      useClass: SubmissionRepositoryMock, 
    },
    {
      provide: 'ISqlExecutor',
      useClass: SqlExecutorStub,
    },
    {
      provide: 'IAIAssistant',
      useClass: AIAssistantStub,
    },
  ],
})
export class EvaluationModule {}