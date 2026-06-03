import { Global, Module } from '@nestjs/common';
import { ChurchPermissionRepository } from 'src/domain/repositories/church-permission.repository';
import { PermissionRepository } from 'src/domain/repositories/permission.repository';
import { PrismaChurchPermissionRepository } from 'src/infra/repositories/prisma-church-permission.repository';
import { PrismaPermissionRepository } from 'src/infra/repositories/prisma-permission.repository';
import { PermissionsGuard } from 'src/infra/config/abac/permissions.guard';
import { RolesGuard } from 'src/infra/config/rbac/roles.guard';
import { AssignChurchPermissionUsecase } from 'src/application/usecases/permission/assign-church-permission.usecase';
import { AssignChurchPermissionController } from 'src/presentation/controllers/permission/assign-church-permission.controller';
import { ChurchModule } from '../church/church.module';

@Global()
@Module({
  imports: [ChurchModule],
  providers: [
    PrismaPermissionRepository,
    {
      provide: PermissionRepository,
      useExisting: PrismaPermissionRepository,
    },
    PrismaChurchPermissionRepository,
    {
      provide: ChurchPermissionRepository,
      useExisting: PrismaChurchPermissionRepository,
    },
    PermissionsGuard,
    RolesGuard,
    AssignChurchPermissionUsecase,
  ],
  controllers: [AssignChurchPermissionController],
  exports: [
    PermissionRepository,
    ChurchPermissionRepository,
    PermissionsGuard,
    RolesGuard,
  ],
})
export class PermissionModule {}
