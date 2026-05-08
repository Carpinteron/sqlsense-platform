export class UserResponseDto {
  id: number;
  email: string;
  role: 'ADMIN' | 'PROFESSOR' | 'STUDENT';
  createdAt: Date | null;

  constructor(id: number, email: string, role: 'ADMIN' | 'PROFESSOR' | 'STUDENT', createdAt: Date | null) {
    this.id = id;
    this.email = email;
    this.role = role;
    this.createdAt = createdAt;
  }
}
