import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service'; 
import type { IUserAuthRepository } from '../../domain/repositories/user-auth.repository';
import type { AuthPayload } from '../../domain/entities/auth-payload.entity';
import type { IUserManagementRepository } from '../../../users/domain/repositories/user-management.repository';
import { User } from '../../../users/domain/entities/user.entity';
import * as bcrypt from 'bcrypt';

const BCRYPT_ROUNDS = 10;

@Injectable()
export class UserRepository implements IUserAuthRepository, IUserManagementRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Auth method: Validate login credentials
   */
  async validateCredentials(email: string, password: string): Promise<AuthPayload | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) return null;

    return {
      sub: user.id,        
      email: user.email,
      role: user.role, 
    };
  }

  /**
   * Management: List all users
   */
  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map(u => new User(u.id, u.email, u.password, u.role, u.createdAt));
  }

  /**
   * Management: Get user by ID
   */
  async findById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return new User(user.id, user.email, user.password, user.role, user.createdAt);
  }

  /**
   * Management: Get user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return new User(user.id, user.email, user.password, user.role, user.createdAt);
  }

  /**
   * Management: Create a new user with hashed password
   */
  async create(email: string, hashedPassword: string, role: string = 'STUDENT'): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role as any,
      },
    });

    return new User(newUser.id, newUser.email, newUser.password, newUser.role, newUser.createdAt);
  }

  /**
   * Management: Update user (email and/or password)
   */
  async update(id: number, email?: string, hashedPassword?: string): Promise<User | null> {
    const updateData: any = {};
    
    if (email !== undefined) updateData.email = email;
    if (hashedPassword !== undefined) updateData.password = hashedPassword;

    if (Object.keys(updateData).length === 0) return this.findById(id);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    return new User(updatedUser.id, updatedUser.email, updatedUser.password, updatedUser.role, updatedUser.createdAt);
  }

  /**
   * Management: Delete user by ID
   */
  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Management: Change user role
   */
  async changeRole(id: number, newRole: string): Promise<User | null> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { role: newRole as any },
    });

    return new User(updatedUser.id, updatedUser.email, updatedUser.password, updatedUser.role, updatedUser.createdAt);
  }

  /**
   * Hash a plaintext password using bcrypt
   */
  async hashPassword(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, BCRYPT_ROUNDS);
  }
}