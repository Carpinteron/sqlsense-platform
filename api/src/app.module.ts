import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { AuthModule } from './auth/auth.module';
// import { RedisModule } from './shared/infrastructure/redis/redis.module';
import { SchemasModule } from './schemas/schemas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // RedisModule,
    // AuthModule,
    SchemasModule,
  ],
})
export class AppModule {}