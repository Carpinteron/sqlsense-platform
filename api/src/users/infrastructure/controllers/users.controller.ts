import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
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
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { ChangeUserRoleDto } from '../../application/dtos/change-user-role.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { UserResponseDto } from '../../application/dtos/user-response.dto';
import { DeleteUserResponseDto } from '../../application/dtos/delete-user-response.dto';
import { ChangeUserRoleUseCase } from '../../application/use-cases/change-user-role.use-case';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';
import { GetAllUsersUseCase } from '../../application/use-cases/get-all-users.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';

@ApiTags('Users')
@ApiBearerAuth('JWT')
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
  @ApiOperation({
    summary: 'Listar todos los usuarios',
    description: 'Solo rol **ADMIN**.',
  })
  @ApiResponse({ status: 200, description: 'Lista de usuarios', type: [UserResponseDto] })
  @ApiUnauthorizedResponse({ description: 'JWT inválido o ausente' })
  @ApiForbiddenResponse({ description: 'Rol distinto de ADMIN' })
  async getAllUsers() {
    return this.getAllUsersUseCase.execute();
  }

  @Get(':id')
  @SetMetadata('roles', ['ADMIN', 'PROFESSOR', 'STUDENT'])
  @ApiOperation({
    summary: 'Obtener usuario por ID',
    description: '**ADMIN**: cualquier ID. **PROFESSOR/STUDENT**: solo su propio ID.',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: UserResponseDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({ description: 'No es el propio usuario ni ADMIN' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  async getUserById(@Param('id', ParseIntPipe) id: number, @Request() req: { user: { id: number; role: string } }) {
    this.ensureSelfOrAdmin(req.user, id);
    return this.getUserByIdUseCase.execute(id);
  }

  @Post()
  @HttpCode(201)
  @SetMetadata('roles', ['ADMIN'])
  @ApiOperation({ summary: 'Crear usuario', description: 'Solo **ADMIN**.' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Usuario creado', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Email ya registrado o validación fallida' })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async createUser(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }

  @Put(':id')
  @SetMetadata('roles', ['ADMIN', 'PROFESSOR', 'STUDENT'])
  @ApiOperation({
    summary: 'Actualizar usuario',
    description: '**ADMIN**: cualquier usuario. Otros roles: solo su propio perfil.',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Usuario actualizado', type: UserResponseDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @Request() req: { user: { id: number; role: string } },
  ) {
    this.ensureSelfOrAdmin(req.user, id);
    return this.updateUserUseCase.execute(id, dto);
  }

  @Delete(':id')
  @SetMetadata('roles', ['ADMIN'])
  @ApiOperation({ summary: 'Eliminar usuario', description: 'Solo **ADMIN**.' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Eliminado', type: DeleteUserResponseDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.deleteUserUseCase.execute(id);
    return { message: 'Usuario eliminado exitosamente' };
  }

  @Patch(':id/role')
  @SetMetadata('roles', ['ADMIN'])
  @ApiOperation({
    summary: 'Cambiar rol de un usuario',
    description: 'Solo **ADMIN**. El actor debe ser ADMIN.',
  })
  @ApiParam({ name: 'id', example: 2 })
  @ApiBody({ type: ChangeUserRoleDto })
  @ApiResponse({ status: 200, description: 'Rol actualizado', type: UserResponseDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  async changeUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangeUserRoleDto,
    @Request() req: { user: { id: number } },
  ) {
    return this.changeUserRoleUseCase.execute(req.user.id, id, dto.role);
  }
}
