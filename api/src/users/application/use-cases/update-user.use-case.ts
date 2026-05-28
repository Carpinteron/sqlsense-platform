import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { IUserManagementRepository } from '../../domain/repositories/user-management.repository';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('IUserManagementRepository')
    private readonly userRepository: IUserManagementRepository,
  ) {}

  async execute(id: number, dto: UpdateUserDto): Promise<UserResponseDto> {
    const existing = await this.userRepository.findById(id);
    if (!existing) throw new NotFoundException('Usuario no encontrado');

    if (dto.email && dto.email !== existing.email) {
      const byEmail = await this.userRepository.findByEmail(dto.email);
      if (byEmail) throw new BadRequestException('Email ya en uso');
    }

    let hashed: string | undefined = undefined;
    if (dto.password) hashed = await bcrypt.hash(dto.password, 10);

    const updated = await this.userRepository.update(id, dto.email, hashed);

    if (!updated) throw new NotFoundException('Usuario no encontrado');

    return new UserResponseDto(updated.id, updated.email, updated.role, updated.createdAt);
  }
}
