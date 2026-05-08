import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { ChangeUserRoleDto } from '../../application/dtos/change-user-role.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { ChangeUserRoleUseCase } from '../../application/use-cases/change-user-role.use-case';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';
import { GetAllUsersUseCase } from '../../application/use-cases/get-all-users.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly changeUserRoleUseCase: ChangeUserRoleUseCase,
  ) {}

  private ensureSelfOrAdmin(requestUser: { id: number; role: string }, targetId: number): void {
    if (requestUser.role !== 'ADMIN' && requestUser.id !== targetId) {
      throw new ForbiddenException('No tienes permisos para acceder a este recurso');
    }
  }

  @Get()
  @SetMetadata('roles', ['ADMIN'])
  async getAllUsers() {
    return this.getAllUsersUseCase.execute();
  }

  @Get(':id')
  @SetMetadata('roles', ['ADMIN', 'PROFESSOR', 'STUDENT'])
  async getUserById(@Param('id', ParseIntPipe) id: number, @Request() req) {
    this.ensureSelfOrAdmin(req.user, id);
    return this.getUserByIdUseCase.execute(id);
  }

  @Post()
  @SetMetadata('roles', ['ADMIN'])
  async createUser(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }

  @Put(':id')
  @SetMetadata('roles', ['ADMIN', 'PROFESSOR', 'STUDENT'])
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @Request() req,
  ) {
    this.ensureSelfOrAdmin(req.user, id);
    return this.updateUserUseCase.execute(id, dto);
  }

  @Delete(':id')
  @SetMetadata('roles', ['ADMIN'])
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.deleteUserUseCase.execute(id);
    return { message: 'Usuario eliminado exitosamente' };
  }

  @Patch(':id/role')
  @SetMetadata('roles', ['ADMIN'])
  async changeUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangeUserRoleDto,
    @Request() req,
  ) {
    return this.changeUserRoleUseCase.execute(req.user.id, id, dto.role);
  }
}