import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import type { Challenge } from '../../domain/entities/challege.entity';
import type { IChallengeRepository } from '../../domain/repositories/challege.repository';

type ChallengeRow = Prisma.challengesGetPayload<{}>;

@Injectable()
export class ChallengeRepository implements IChallengeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(challenge: Omit<Challenge, 'id' | 'created_at'>): Promise<Challenge> {
    const createdReto = await this.prismaService.challenges.create({
      data: {
        title: challenge.title,
        description: challenge.description,
        difficulty: challenge.difficulty ?? null,
        tags: challenge.tags ?? [],
        database_engine: challenge.databaseEngine ?? 'PostgreSQL',
        time_limit: challenge.timeLimit ?? null,
        status: challenge.status ?? 'draft',
        course_id: challenge.courseId ?? null,
        created_by: challenge.createdBy ?? null,
        schema_sql: challenge.schemaSql ?? null,
        seed_data_sql: challenge.seedDataSql ?? null,
        expected_result: challenge.expectedResult ?? Prisma.JsonNull,
      },
    });

    return this.toDomain(createdReto);
  }

  async findById(id: string): Promise<Challenge | null> {
    const challenge = await this.prismaService.challenges.findUnique({
      where: { id },
    });

    return challenge ? this.toDomain(challenge) : null;
  }

  async findByTitle(title: string): Promise<Challenge | null> {
    const challenge  = await this.prismaService.challenges.findFirst({
      where: { title },
    });

    return challenge ? this.toDomain(challenge) : null;
  }

  async findAll(filter?: { courseId?: string; difficulty?: 'Easy' | 'Medium' | 'Hard' }): Promise<Challenge[]> {
    const where: any = {};
    if (filter?.courseId !== undefined) {
      where.course_id = filter.courseId;
    }
    if (filter?.difficulty !== undefined) {
      where.difficulty = filter.difficulty;
    }

    const challenges = await this.prismaService.challenges.findMany({
      where,
      orderBy: {
        created_at: 'desc',
      },
    });

    return challenges.map((challenge) => this.toDomain(challenge));
  }

  async update(id: string, updates: Partial<Omit<Challenge, 'id' | 'created_at'>>): Promise<Challenge> {
    const updatedReto = await this.prismaService.challenges.update({
      where: { id },
      data: {
        ...(updates.title !== undefined ? { title: updates.title } : {}),
        ...(updates.description !== undefined ? { description: updates.description } : {}),
        ...(updates.difficulty !== undefined ? { difficulty: updates.difficulty } : {}),
        ...(updates.tags !== undefined ? { tags: updates.tags } : {}),
        ...(updates.databaseEngine !== undefined ? { database_engine: updates.databaseEngine } : {}),
        ...(updates.timeLimit !== undefined ? { time_limit: updates.timeLimit } : {}),
        ...(updates.status !== undefined ? { status: updates.status } : {}),
        ...(updates.schemaSql !== undefined ? { schema_sql: updates.schemaSql } : {}),
        ...(updates.seedDataSql !== undefined ? { seed_data_sql: updates.seedDataSql } : {}),
        ...(updates.expectedResult !== undefined ? { expected_result: updates.expectedResult ?? Prisma.JsonNull } : {}),
      },
    });

    return this.toDomain(updatedReto);
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.challenges.delete({
      where: { id },
    });
  }

  private toDomain(challenge: ChallengeRow): Challenge {
    return {
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      difficulty: (challenge.difficulty as Challenge['difficulty']) ?? undefined,
      tags: challenge.tags ?? undefined,
      databaseEngine: challenge.database_engine ?? undefined,
      timeLimit: challenge.time_limit ?? undefined,
      status: (challenge.status as Challenge['status']) ?? undefined,
      courseId: challenge.course_id ?? undefined,
      createdBy: challenge.created_by ?? undefined,
      schemaSql: challenge.schema_sql ?? undefined,
      seedDataSql: challenge.seed_data_sql ?? undefined,
      expectedResult: (challenge.expected_result as object | null) ?? undefined,
      createdAt: challenge.created_at ?? undefined,
    };
  }
}