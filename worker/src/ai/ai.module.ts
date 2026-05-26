import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LmStudioService } from './infrastructure/lm-studio.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'IAiGeneratorPort',
      useClass: LmStudioService,
    },
  ],
  exports: ['IAiGeneratorPort'],
})
export class AiModule {}
