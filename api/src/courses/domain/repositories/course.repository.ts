import type { Course } from '../entities/course.entity';

export interface ICourseRepository {
  create(course: Omit<Course, 'id' | 'createdAt'>): Promise<Course>;
  findById(id: string): Promise<Course | null>;
  findAll(filter?: { professorId?: number; period?: string }): Promise<Course[]>;
  findByCode(code: string): Promise<Course | null>;
  update(id: string, updates: Partial<Omit<Course, 'id' | 'createdAt'>>): Promise<Course>;
  delete(id: string): Promise<void>;
  addStudent(courseId: string, studentId: number): Promise<void>;
  findStudentsByCourseId(courseId: string): Promise<Array<{
    id: number;
    email: string;
    role: string;
    createdAt: Date | null;
  }>>;
  findCoursesByStudentId(studentId: number): Promise<Course[]>;
  studentExists(studentId: number): Promise<boolean>;
}
