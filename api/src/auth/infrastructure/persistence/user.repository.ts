import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service'; 
import type { IUserAuthRepository } from '../../domain/repositories/user-auth.repository';
import type { AuthPayload } from '../../domain/entities/auth-payload.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository implements IUserAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async validateCredentials(email: string, pass: string): Promise<AuthPayload | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    const isMatch = await bcrypt.compare(pass, user.password);
    
    if (!isMatch) return null;

    return {
      sub: user.id,        
      email: user.email,
      role: user.role, 
    };
  }
}