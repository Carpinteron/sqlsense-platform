import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IUserManagementRepository } from '../../domain/repositories/user-management.repository';
import { UserResponseDto } from '../dtos/user-response.dto';

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject('IUserManagementRepository')
    private readonly userRepository: IUserManagementRepository,
  ) {}

  async execute(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return new UserResponseDto(user.id, user.email, user.role as any, user.createdAt);
  }
}
