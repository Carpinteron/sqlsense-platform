import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import type { Curso } from '../../domain/entities/curso.entity';
import type { ICursoRepository } from '../../domain/repositories/curso.repository';

type CourseRow = Prisma.CourseGetPayload<{
  include: {
    users: true;
  };
}>;

@Injectable()
export class CursoRepository implements ICursoRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(course: Omit<Curso, 'id' | 'createdAt'>): Promise<Curso> {
    const createdCourse = await this.prismaService.course.create({
      data: {
        name: course.name,
        code: course.code,
        period: course.period,
        groupNumber: course.groupNumber ?? null,
        professor_id: course.professorId ?? null,
      },
      include: {
        users: true,
      },
    });

    return this.toDomain(createdCourse);
  }

  async findById(id: string): Promise<Curso | null> {
    const course = await this.prismaService.course.findUnique({
      where: { id },
      include: {
        users: true,
      },
    });

    return course ? this.toDomain(course) : null;
  }

  async findAll(filter?: { professorId?: string; period?: string }): Promise<Curso[]> {
    const courses = await this.prismaService.course.findMany({
      where: {
        professor_id: filter?.professorId,
        period: filter?.period,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        users: true,
      },
    });

    return courses.map((course) => this.toDomain(course));
  }

  async findByCode(code: string): Promise<Curso | null> {
    const course = await this.prismaService.course.findUnique({
      where: { code },
      include: {
        users: true,
      },
    });

    return course ? this.toDomain(course) : null;
  }

  async update(id: string, updates: Partial<Omit<Curso, 'id' | 'createdAt'>>): Promise<Curso> {
    const updatedCourse = await this.prismaService.course.update({
      where: { id },
      data: {
        ...(updates.name !== undefined ? { name: updates.name } : {}),
        ...(updates.code !== undefined ? { code: updates.code } : {}),
        ...(updates.period !== undefined ? { period: updates.period } : {}),
        ...(updates.groupNumber !== undefined ? { groupNumber: updates.groupNumber } : {}),
        ...(updates.professorId !== undefined
          ? { professor_id: updates.professorId }
          : {}),
      },
      include: {
        users: true,
      },
    });

    return this.toDomain(updatedCourse);
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.course.delete({
      where: { id },
    });
  }

  private toDomain(course: CourseRow): Curso {
    return {
      id: course.id,
      name: course.name,
      code: course.code,
      period: course.period,
      groupNumber: course.groupNumber ?? undefined,
      professorId: course.professor_id ?? undefined,
      createdAt: course.createdAt ?? undefined,
    };
  }
}