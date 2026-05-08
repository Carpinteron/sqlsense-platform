export class CreateUserDto {
  email: string;
  password: string;
  role?: 'ADMIN' | 'PROFESSOR' | 'STUDENT';

  constructor(email: string, password: string, role?: 'ADMIN' | 'PROFESSOR' | 'STUDENT') {
    this.email = email;
    this.password = password;
    this.role = role || 'STUDENT';
  }
}
