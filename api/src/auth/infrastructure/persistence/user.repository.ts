import { Injectable } from '@nestjs/common';
import type { IUserAuthRepository } from '../../domain/repositories/user-auth.repository';
import type { AuthPayload } from '../../domain/entities/auth-payload.entity';

@Injectable()
export class UserRepository implements IUserAuthRepository {
  async validateCredentials(email: string, pass: string): Promise<AuthPayload | null> {
    // Simulamos una base de datos con un usuario de prueba
    const MOCK_USER = {
      email: 'admin@test.com',
      password: 'password123',
      data: { sub: 1, email: 'admin@test.com', role: 'ADMIN' }
    };

    if (email === MOCK_USER.email && pass === MOCK_USER.password) {
      return MOCK_USER.data;
    }

    return null;
  }
}