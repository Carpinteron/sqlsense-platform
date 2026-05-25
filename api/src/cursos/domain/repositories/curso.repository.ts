import type { Curso } from '../entities/curso.entity';

export interface ICursoRepository {
  create(course: Omit<Curso, 'id' | 'createdAt'>): Promise<Curso>;
  findById(id: string): Promise<Curso | null>;
  findAll(filter?: { professorId?: number; period?: string }): Promise<Curso[]>;
  findByCode(code: string): Promise<Curso | null>;
  update(id: string, updates: Partial<Omit<Curso, 'id' | 'createdAt'>>): Promise<Curso>;
  delete(id: string): Promise<void>;
  addStudent(courseId: string, studentId: number): Promise<void>;
  findStudentsByCourseId(courseId: string): Promise<Array<{
    id: number;
    email: string;
    role: string;
    createdAt: Date | null;
  }>>;
  findCoursesByStudentId(studentId: number): Promise<Curso[]>;
  studentExists(studentId: number): Promise<boolean>;
}
