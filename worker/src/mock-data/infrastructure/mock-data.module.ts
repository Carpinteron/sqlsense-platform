import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MockDataProcessor } from './processors/mock-data.processor';
import { MockDataChunkProcessor } from './processors/mock-data-chunk.processor';
import { MockDataCombineProcessor } from './processors/mock-data-combine.processor';
import { AiMockDataAdapter } from './external/ai-mock-data.adapter';
import { GenerateMockDataUseCase } from '../application/use-cases/generate-mock-data.use-case';

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get('REDIS_HOST', 'redis'),
          port: config.get<number>('REDIS_PORT', 6379),
        },
      }),
    }),
    BullModule.registerQueue(
      { name: 'mock-data-queue' },
      { name: 'mock-data-chunk-queue' },
      { name: 'mock-data-combine-queue' },
    ),
  ],
  providers: [
    MockDataProcessor,
    MockDataChunkProcessor,
    MockDataCombineProcessor,
    GenerateMockDataUseCase,
    {
      provide: 'IAiMockDataPort',
      useClass: AiMockDataAdapter,
    },
  ],
})
export class MockDataModule {}
