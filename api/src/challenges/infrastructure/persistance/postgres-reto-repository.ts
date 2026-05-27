import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import type { Reto } from '../../domain/entities/challege.entity';
import type { IRetoRepository } from '../../domain/repositories/challege.repository';

type ChallengeRow = Prisma.challengesGetPayload<{}>;

@Injectable()
export class RetoRepository implements IRetoRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(reto: Omit<Reto, 'id' | 'created_at'>): Promise<Reto> {
    const createdReto = await this.prismaService.challenges.create({
      data: {
        title: reto.title,
        description: reto.description,
        difficulty: reto.difficulty ?? null,
        tags: reto.tags ?? [],
        database_engine: reto.databaseEngine ?? 'PostgreSQL',
        time_limit: reto.timeLimit ?? null,
        status: reto.status ?? 'draft',
        course_id: reto.courseId ?? null,
        created_by: reto.createdBy ?? null,
        schema_sql: reto.schemaSql ?? null,
        seed_data_sql: reto.seedDataSql ?? null,
        expected_result: reto.expectedResult ?? Prisma.JsonNull,
      },
    });

    return this.toDomain(createdReto);
  }

  async findById(id: string): Promise<Reto | null> {
    const reto = await this.prismaService.challenges.findUnique({
      where: { id },
    });

    return reto ? this.toDomain(reto) : null;
  }

  async findByTitle(title: string): Promise<Reto | null> {
    const reto = await this.prismaService.challenges.findFirst({
      where: { title },
    });

    return reto ? this.toDomain(reto) : null;
  }

  async findAll(filter?: { courseId?: string; difficulty?: 'Easy' | 'Medium' | 'Hard' }): Promise<Reto[]> {
    const where: any = {};
    if (filter?.courseId !== undefined) {
      where.course_id = filter.courseId;
    }
    if (filter?.difficulty !== undefined) {
      where.difficulty = filter.difficulty;
    }

    const retos = await this.prismaService.challenges.findMany({
      where,
      orderBy: {
        created_at: 'desc',
      },
    });

    return retos.map((reto) => this.toDomain(reto));
  }

  async update(id: string, updates: Partial<Omit<Reto, 'id' | 'created_at'>>): Promise<Reto> {
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

  private toDomain(reto: ChallengeRow): Reto {
    return {
      id: reto.id,
      title: reto.title,
      description: reto.description,
      difficulty: (reto.difficulty as Reto['difficulty']) ?? undefined,
      tags: reto.tags ?? undefined,
      databaseEngine: reto.database_engine ?? undefined,
      timeLimit: reto.time_limit ?? undefined,
      status: (reto.status as Reto['status']) ?? undefined,
      courseId: reto.course_id ?? undefined,
      createdBy: reto.created_by ?? undefined,
      schemaSql: reto.schema_sql ?? undefined,
      seedDataSql: reto.seed_data_sql ?? undefined,
      expectedResult: (reto.expected_result as object | null) ?? undefined,
      createdAt: reto.created_at ?? undefined,
    };
  }
}