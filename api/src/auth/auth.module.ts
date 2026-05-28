import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './infrastructure/controller/auth.controller';
import { RedisTokenRepository } from './infrastructure/persistence/redis-token.repository';
import { GenerateTokensUseCase } from './application/use-cases/generate-tokens.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { JwtStrategy } from './infrastructure/guards/jwt.strategy'; 
import { UserRepository } from './infrastructure/persistence/user.repository';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { PrismaModule } from '../shared/infrastructure/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { 
          expiresIn: config.get<string>('JWT_ACCESS_EXPIRATION', '15m') as any 
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    GenerateTokensUseCase,
    RefreshTokenUseCase,
    LoginUseCase,
    LogoutUseCase,
    JwtStrategy,
    {
      provide: 'ITokenStorageRepository',
      useClass: RedisTokenRepository,
    },
    {
    provide: 'IUserAuthRepository',
    useClass: UserRepository,   // TODO implementar postgresql, remover mock
    },
  ],
  exports: [GenerateTokensUseCase],
})
export class AuthModule {}