import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './infra/config/prisma/prisma.module';
import { RegisterModule } from './infra/modules/register/register.module';
import { ChurchModule } from './infra/modules/church/church.module';
import { UserModule } from './infra/modules/user/user.module';
import { AuthModule } from './infra/modules/auth/auth.module';
import { JwtAuthGuard } from './infra/config/jwt/jwt-auth.guard';

@Module({
  imports: [PrismaModule, RegisterModule, ChurchModule, UserModule, AuthModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

