import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { ITokenStorageRepository } from '../../domain/repositories/token-storage.repository';

@Injectable()
export class RedisTokenRepository implements ITokenStorageRepository {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async save(userId: number, token: string, ttl: number): Promise<void> {
    await this.redis.setex(`refresh_token:${userId}`, ttl, token);
  }

  async get(userId: number): Promise<string | null> {
    return this.redis.get(`refresh_token:${userId}`);
  }

  async delete(userId: number): Promise<void> {
    await this.redis.del(`refresh_token:${userId}`);
  }
}