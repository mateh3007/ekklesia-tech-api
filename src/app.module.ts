import { Module } from '@nestjs/common';
import { PrismaModule } from './infra/config/prisma/prisma.module';
import { RegisterModule } from './infra/modules/register/register.module';
import { ChurchModule } from './infra/modules/church/church.module';
import { UserModule } from './infra/modules/user/user.module';

@Module({
  imports: [PrismaModule, RegisterModule, ChurchModule, UserModule],
})
export class AppModule {}

