import { Module } from '@nestjs/common';
import { PrismaModule } from '../shared/infrastructure/prisma/prisma.module';
import { EvaluationsController } from './infrastructure/controllers/evaluations.controller';

@Module({
  imports: [PrismaModule],
  controllers: [EvaluationsController],
})
export class EvaluationsModule {}