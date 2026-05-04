export interface Curso {
  id: string; // UUID
  name: string;
  code: string;
  period: string;
  groupNumber?: string; // corresponds to group_number
  professorId?: string; // UUID referencing auth.users(id)
  createdAt?: Date | string;
}
