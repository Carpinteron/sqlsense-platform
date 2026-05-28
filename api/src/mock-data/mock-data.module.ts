import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MockDataController } from './infrastructure/controller/mock-data.controller';
import { EnqueueMockDataUseCase } from './application/use-cases/enqueue-mock-data.use-case';
import { GetMockDataJobUseCase } from './application/use-cases/get-mock-data-job.use-case';

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST', 'redis'),
          port: config.get<number>('REDIS_PORT', 6379),
        },
      }),
    }),
    BullModule.registerQueue(
      { name: 'mock-data-queue' },
      { name: 'mock-data-combine-queue' },
    ),
    BullModule.registerFlowProducer({ name: 'mock-data-flow' }),
  ],
  controllers: [MockDataController],
  providers: [EnqueueMockDataUseCase, GetMockDataJobUseCase],
})
export class MockDataModule {}
