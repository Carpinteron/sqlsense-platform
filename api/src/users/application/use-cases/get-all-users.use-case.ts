import { Injectable, Inject } from '@nestjs/common';
import type { IUserManagementRepository } from '../../domain/repositories/user-management.repository';
import { UserResponseDto } from '../dtos/user-response.dto';

@Injectable()
export class GetAllUsersUseCase {
  constructor(
    @Inject('IUserManagementRepository')
    private readonly userRepository: IUserManagementRepository,
  ) {}

  async execute(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return users.map(
      user =>
        new UserResponseDto(user.id, user.email, user.role as any, user.createdAt),
    );
  }
}
