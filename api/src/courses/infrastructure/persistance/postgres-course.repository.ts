import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import type { Course } from '../../domain/entities/course.entity';
import type { ICourseRepository } from '../../domain/repositories/course.repository';

type CourseRow = Prisma.CourseGetPayload<{}>;

@Injectable()
export class CourseRepository implements ICourseRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(course: Omit<Course, 'id' | 'createdAt'>): Promise<Course> {
    const createdCourse = await this.prismaService.course.create({
      data: {
        name: course.name,
        code: course.code,
        period: course.period,
        groupNumber: course.groupNumber ?? null,
        professor_id: course.professorId ,
      },
    });

    return this.toDomain(createdCourse);
  }

  async findById(id: string): Promise<Course | null> {
    const course = await this.prismaService.course.findUnique({
      where: { id },
    });

    return course ? this.toDomain(course) : null;
  }

  async findAll(filter?: { professorId?: number; period?: string }): Promise<Course[]> {
    const where: any = {};
    if (filter?.professorId !== undefined) {
      where.professor_id = filter.professorId;
    }
    if (filter?.period !== undefined) {
      where.period = filter.period;
    }

    const courses = await this.prismaService.course.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return courses.map((course) => this.toDomain(course));
  }

  async findByCode(code: string): Promise<Course | null> {
    const course = await this.prismaService.course.findUnique({
      where: { code },
    });

    return course ? this.toDomain(course) : null;
  }

  async update(id: string, updates: Partial<Omit<Course, 'id' | 'createdAt'>>): Promise<Course> {
    const updatedCourse = await this.prismaService.course.update({
      where: { id },
      data: {
        ...(updates.name !== undefined ? { name: updates.name } : {}),
        ...(updates.code !== undefined ? { code: updates.code } : {}),
        ...(updates.period !== undefined ? { period: updates.period } : {}),
        ...(updates.groupNumber !== undefined ? { groupNumber: updates.groupNumber } : {}),
        ...(updates.professorId !== undefined
          ? { professor_id: Number(updates.professorId) }
          : {}),
      },
    });

    return this.toDomain(updatedCourse);
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.course.delete({
      where: { id },
    });
  }

  async addStudent(courseId: string, studentId: number): Promise<void> {
    try {
      await this.prismaService.courseStudent.create({
        data: {
          course_id: courseId,
          student_id: studentId,
        },
      });
    } catch (error: any) {
      // Prisma unique constraint on composite key will throw a known request error
      if (error?.code === 'P2002') {
        throw new Error('Estudiante ya inscrito en el curso');
      }
      throw error;
    }
  }

  async findStudentsByCourseId(courseId: string): Promise<Array<{
    id: number;
    email: string;
    role: string;
    createdAt: Date | null;
  }>> {
    const courseStudents = await this.prismaService.courseStudent.findMany({
      where: { course_id: courseId },
      select: {
        users: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        student_id: 'asc',
      },
    });

    return courseStudents.map((courseStudent) => ({
      id: courseStudent.users.id,
      email: courseStudent.users.email,
      role: courseStudent.users.role,
      createdAt: courseStudent.users.createdAt ?? null,
    }));
  }

  async findCoursesByStudentId(studentId: number): Promise<Course[]> {
    const courseStudents = await this.prismaService.courseStudent.findMany({
      where: { student_id: studentId },
      select: {
        courses: true,
      },
      orderBy: {
        course_id: 'asc',
      },
    });

    return courseStudents.map((courseStudent) => this.toDomain(courseStudent.courses));
  }

  async studentExists(studentId: number): Promise<boolean> {
    const student = await this.prismaService.user.findUnique({
      where: { id: studentId },
      select: { id: true },
    });

    return Boolean(student);
  }

  private toDomain(course: CourseRow): Course {
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