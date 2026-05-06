import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { MockDataController } from './infrastructure/controller/mock-data.controller';
import { GenerateMockDataUseCase } from './application/use-cases/generate-mock-data.use-case';
import { AiMockDataAdapter } from './infrastructure/adapters/ai-mock-data.adapter';
import { AiMockDataResponseMapper } from './infrastructure/mappers/ai-mock-data-response.mapper';

@Module({
  imports: [AiModule],
  controllers: [MockDataController],
  providers: [
    GenerateMockDataUseCase,
    AiMockDataResponseMapper,
    {
      provide: 'IMockDataGeneratorPort',
      useClass: AiMockDataAdapter,
    },
  ],
})
export class MockDataModule {}
