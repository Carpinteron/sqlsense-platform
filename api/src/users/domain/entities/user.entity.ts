export type UserRole = 'ADMIN' | 'PROFESSOR' | 'STUDENT';

export class User {
  id: number;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date | null;

  constructor(id: number, email: string, password: string, role: UserRole, createdAt: Date | null) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.role = role;
    this.createdAt = createdAt;
  }
}
