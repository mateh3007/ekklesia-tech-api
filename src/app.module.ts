import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './infra/config/prisma/prisma.module';
import { RegisterModule } from './infra/modules/register/register.module';
import { ChurchModule } from './infra/modules/church/church.module';
import { UserModule } from './infra/modules/user/user.module';
import { AuthModule } from './infra/modules/auth/auth.module';
import { PermissionModule } from './infra/modules/permission/permission.module';
import { JwtAuthGuard } from './infra/config/jwt/jwt-auth.guard';
import { RolesGuard } from './infra/config/rbac/roles.guard';
import { PermissionsGuard } from './infra/config/abac/permissions.guard';

@Module({
  imports: [PrismaModule, RegisterModule, ChurchModule, UserModule, AuthModule, PermissionModule],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
})
export class AppModule {}

