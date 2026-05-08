import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import type { IUserManagementRepository } from '../../domain/repositories/user-management.repository';
import type { UserRole } from '../../domain/entities/user.entity';
import { UserResponseDto } from '../dtos/user-response.dto';

const ALLOWED_ROLES: UserRole[] = ['ADMIN', 'PROFESSOR', 'STUDENT'];

@Injectable()
export class ChangeUserRoleUseCase {
  constructor(
    @Inject('IUserManagementRepository')
    private readonly userRepository: IUserManagementRepository,
  ) {}

  async execute(actorUserId: number, targetUserId: number, newRole: UserRole): Promise<UserResponseDto> {
    if (!ALLOWED_ROLES.includes(newRole)) {
      throw new BadRequestException('Rol invalido');
    }

    const targetUser = await this.userRepository.findById(targetUserId);
    if (!targetUser) {
      throw new NotFoundException(`Usuario con ID ${targetUserId} no encontrado`);
    }

    if (actorUserId === targetUserId && newRole !== 'ADMIN') {
      throw new BadRequestException('No puedes degradar tu propio rol de ADMIN');
    }

    const updated = await this.userRepository.changeRole(targetUserId, newRole);
    if (!updated) {
      throw new NotFoundException(`Usuario con ID ${targetUserId} no encontrado`);
    }

    return new UserResponseDto(updated.id, updated.email, updated.role, updated.createdAt);
  }
}