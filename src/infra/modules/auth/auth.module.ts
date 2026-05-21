import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LoginUsecase } from 'src/application/usecases/auth/login.usecase';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { PrismaUserRepository } from 'src/infra/repositories/prisma-user.repository';
import { JwtStrategy } from 'src/infra/config/jwt/jwt.strategy';
import { LoginController } from 'src/presentation/controllers/auth/login.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [
    LoginUsecase,
    JwtStrategy,
    PrismaUserRepository,
    {
      provide: UserRepository,
      useExisting: PrismaUserRepository,
    },
  ],
  controllers: [LoginController],
})
export class AuthModule {}
