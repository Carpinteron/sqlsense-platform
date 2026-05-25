import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CursosModule } from './cursos/cursos.module';
import { PrismaModule } from './shared/infrastructure/prisma/prisma.module';
import { RedisModule } from './shared/infrastructure/redis/redis.module';
import { SchemasModule } from './schemas/schemas.module';
import { RetoModule } from './challenges/reto.module';
import { MockDataModule } from './mock-data/mock-data.module';
import { UsersModule } from './users/users.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { ExpectedQueryModule } from './expected-query/expected-query.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    RedisModule,
    PrismaModule,
    AuthModule,
    CursosModule,
    SchemasModule,
    RetoModule,
    MockDataModule,
    UsersModule,
    SubmissionsModule,
    ExpectedQueryModule,
  ],
})
export class AppModule {}