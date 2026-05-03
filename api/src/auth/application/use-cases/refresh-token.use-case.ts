import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { ITokenStorageRepository } from '../../domain/repositories/token-storage.repository';
import { GenerateTokensUseCase } from './generate-tokens.use-case';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('ITokenStorageRepository')
    private readonly tokenStorage: ITokenStorageRepository,
    private readonly generateTokensUseCase: GenerateTokensUseCase,
  ) {}

  async execute(oldRefreshToken: string) {
    try {
      const payload = this.jwtService.verify(oldRefreshToken);
      const savedToken = await this.tokenStorage.get(payload.sub);

      if (!savedToken || savedToken !== oldRefreshToken) {
        await this.tokenStorage.delete(payload.sub);
        throw new UnauthorizedException('Token inválido o reutilizado');
      }

      return this.generateTokensUseCase.execute({
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      });
    } catch (e) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}