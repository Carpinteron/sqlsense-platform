import { Injectable, Inject } from '@nestjs/common';
import type { ITokenStorageRepository } from '../../domain/repositories/token-storage.repository';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject('ITokenStorageRepository')
    private readonly tokenStorage: ITokenStorageRepository,
  ) {}

  async execute(userId: number): Promise<void> {
    await this.tokenStorage.delete(userId);
  }
}