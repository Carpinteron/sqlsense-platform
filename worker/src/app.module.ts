import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { EvaluationModule } from './evaluation/infrastructure/evaluation.module';
import { MockDataModule } from './mock-data/infrastructure/mock-data.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get('REDIS_HOST', 'redis'), 
          port: config.get<number>('REDIS_PORT', 6379),
        },
      }),
    }),

    EvaluationModule,
    MockDataModule,
  ],
})
export class AppModule {}