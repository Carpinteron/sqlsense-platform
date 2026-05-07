export interface Reto {
  id: string;
  title: string;
  description: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  tags?: string[];
  databaseEngine?: string;
  timeLimit?: number;
  status?: 'draft' | 'published' | 'archived';
  courseId?: string;
  createdBy?: number;
  schemaSql?: string;
  seedDataSql?: string;
  expectedResult?: object | null;
  createdAt?: Date | string;
}