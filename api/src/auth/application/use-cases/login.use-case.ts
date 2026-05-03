import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import type { IUserAuthRepository } from '../../domain/repositories/user-auth.repository';
import { GenerateTokensUseCase } from './generate-tokens.use-case';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('IUserAuthRepository')
    private readonly userAuthRepository: IUserAuthRepository,
    private readonly generateTokensUseCase: GenerateTokensUseCase,
  ) {}

  async execute(email: string, pass: string) {
    const user = await this.userAuthRepository.validateCredentials(email, pass);

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    return this.generateTokensUseCase.execute(user);
  }
}