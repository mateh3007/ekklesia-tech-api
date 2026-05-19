import { Module } from '@nestjs/common';
import { CreateUserUsecase } from 'src/application/usecases/user/create-user.usecase';
import { DeleteUserUsecase } from 'src/application/usecases/user/delete-user.usecase';
import { GetAllUsersUsecase } from 'src/application/usecases/user/get-all-users.usecase';
import { GetUserByIdUsecase } from 'src/application/usecases/user/get-user-by-id.usecase';
import { UpdateUserUsecase } from 'src/application/usecases/user/update-user.usecase';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { PrismaUserRepository } from 'src/infra/repositories/prisma-user.repository';
import { CreateUserController } from 'src/presentation/controllers/user/create-user.controller';
import { DeleteUserController } from 'src/presentation/controllers/user/delete-user.controller';
import { GetAllUsersController } from 'src/presentation/controllers/user/get-all-users.controller';
import { GetUserByIdController } from 'src/presentation/controllers/user/get-user-by-id.controller';
import { UpdateUserController } from 'src/presentation/controllers/user/update-user.controller';

@Module({
  providers: [
    CreateUserUsecase,
    GetUserByIdUsecase,
    GetAllUsersUsecase,
    UpdateUserUsecase,
    DeleteUserUsecase,
    PrismaUserRepository,
    {
      provide: UserRepository,
      useExisting: PrismaUserRepository,
    },
  ],
  controllers: [
    CreateUserController,
    GetUserByIdController,
    GetAllUsersController,
    UpdateUserController,
    DeleteUserController,
  ],
})
export class UserModule {}
