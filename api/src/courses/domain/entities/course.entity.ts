export interface Course {
  id: string; // UUID
  name: string;
  code: string;
  period: string;
  groupNumber?: string; // corresponds to group_number
  professorId?: number; // Int referencing auth.users(id)
  createdAt?: Date | string;
}
