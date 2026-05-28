import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { IUserManagementRepository } from '../../domain/repositories/user-management.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserManagementRepository')
    private readonly userRepository: IUserManagementRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) throw new BadRequestException('Email ya registrado');

    const hashed = await bcrypt.hash(dto.password, 10);

    const created = await this.userRepository.create(dto.email, hashed, dto.role ?? 'STUDENT');

    return new UserResponseDto(created.id, created.email, created.role, created.createdAt);
  }
}
