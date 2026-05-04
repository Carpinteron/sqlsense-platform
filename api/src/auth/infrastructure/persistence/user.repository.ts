import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
import type { IUserAuthRepository } from '../../domain/repositories/user-auth.repository';
import type { AuthPayload } from '../../domain/entities/auth-payload.entity';

@Injectable()
export class UserRepository implements IUserAuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async validateCredentials(email: string, pass: string): Promise<AuthPayload | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      include: { roles: true },
    });

    if (!user) {
      return null;
    }

    const passwordMatches = await compare(pass, user.password);

    if (!passwordMatches) {
      return null;
    }

    return {
      sub: user.id,
      email: user.email,
      role: user.roles?.name ?? 'USER',
    };
  }
}