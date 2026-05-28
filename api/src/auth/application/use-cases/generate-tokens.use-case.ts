import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { ITokenStorageRepository } from '../../domain/repositories/token-storage.repository';
import { AuthPayload } from '../../domain/entities/auth-payload.entity';

@Injectable()
export class GenerateTokensUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject('ITokenStorageRepository')
    private readonly tokenStorage: ITokenStorageRepository,
  ) {}

  async execute(payload: AuthPayload) {
    const accessToken = this.jwtService.sign(payload, { 
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION') 
    });
    
    const refreshToken = this.jwtService.sign(payload, { 
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION') 
    });

    const ttl = Number(this.configService.get('REDIS_REFRESH_TTL'));
    await this.tokenStorage.save(payload.sub, refreshToken, ttl);

    return { access_token: accessToken, refresh_token: refreshToken };
  }
}