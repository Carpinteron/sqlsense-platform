export type UserRole = 'ADMIN' | 'PROFESSOR' | 'STUDENT';

export class User {
  id: number;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;

  constructor(id: number, email: string, password: string, role: UserRole, createdAt: Date) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.role = role;
    this.createdAt = createdAt;
  }
}
