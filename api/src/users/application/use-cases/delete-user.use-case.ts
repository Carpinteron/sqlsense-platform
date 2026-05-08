import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import type { IUserManagementRepository } from '../../domain/repositories/user-management.repository';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject('IUserManagementRepository')
    private readonly userRepository: IUserManagementRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const existing = await this.userRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new BadRequestException('No se pudo eliminar el usuario');
    }
  }
}