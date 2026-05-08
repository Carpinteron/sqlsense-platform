import { Module } from '@nestjs/common';
import { PrismaModule } from '../shared/infrastructure/prisma/prisma.module';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { GetAllUsersUseCase } from './application/use-cases/get-all-users.use-case';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { UserRepository } from '../auth/infrastructure/persistence/user.repository';
import { UsersController } from './infrastructure/controllers/users.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    UpdateUserUseCase,
    GetAllUsersUseCase,
    GetUserByIdUseCase,
    DeleteUserUseCase,
    // Bind the repository token to the existing implementation
    {
      provide: 'IUserManagementRepository',
      useClass: UserRepository,
    },
  ],
  exports: [
    CreateUserUseCase,
    UpdateUserUseCase,
    GetAllUsersUseCase,
    GetUserByIdUseCase,
    DeleteUserUseCase,
  ],
})
export class UsersModule {}
