import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { RegisterModule } from './infra/modules/register/register.module';
import { ChurchModule } from './infra/modules/church/church.module';

@Module({
  imports: [PrismaModule, RegisterModule, ChurchModule],
})
export class AppModule {}

