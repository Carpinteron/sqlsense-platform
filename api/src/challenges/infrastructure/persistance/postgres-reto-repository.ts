import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import type { Reto } from '../../domain/entities/reto.entity';
import type { IRetoRepository } from '../../domain/repositories/reto.repository';

type ChallengeRow = Prisma.ChallengeGetPayload<{}>;

@Injectable()
export class RetoRepository implements IRetoRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(reto: Omit<Reto, 'id' | 'createdAt'>): Promise<Reto> {
    const createdReto = await this.prismaService.challenge.create({
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
        expected_result: reto.expectedResult ?? null,
      },
    });

    return this.toDomain(createdReto);
  }

  async findById(id: string): Promise<Reto | null> {
    const reto = await this.prismaService.challenge.findUnique({
      where: { id },
    });

    return reto ? this.toDomain(reto) : null;
  }

  async findByTitle(title: string): Promise<Reto | null> {
    const reto = await this.prismaService.challenge.findFirst({
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

    const retos = await this.prismaService.challenge.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return retos.map((reto) => this.toDomain(reto));
  }

  async update(id: string, updates: Partial<Omit<Reto, 'id' | 'createdAt'>>): Promise<Reto> {
    const updatedReto = await this.prismaService.challenge.update({
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
        ...(updates.expectedResult !== undefined ? { expected_result: updates.expectedResult } : {}),
      },
    });

    return this.toDomain(updatedReto);
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.challenge.delete({
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
      expectedResult: reto.expected_result ?? undefined,
      createdAt: reto.createdAt ?? undefined,
    };
  }
}