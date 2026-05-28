import { Module } from '@nestjs/common';
import { PrismaModule } from '../shared/infrastructure/prisma/prisma.module';
import { AdminAnalyticsController } from './infrastructure/controllers/admin-analytics.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AdminAnalyticsController],
})
export class AnalyticsModule {}