import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LoginUsecase } from 'src/application/usecases/auth/login.usecase';
import { ForgotPasswordUsecase } from 'src/application/usecases/auth/forgot-password.usecase';
import { ResetPasswordUsecase } from 'src/application/usecases/auth/reset-password.usecase';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { PasswordResetTokenRepository } from 'src/domain/repositories/password-reset-token.repository';
import { PrismaUserRepository } from 'src/infra/repositories/prisma-user.repository';
import { PrismaPasswordResetTokenRepository } from 'src/infra/repositories/prisma-password-reset-token.repository';
import { JwtStrategy } from 'src/infra/config/jwt/jwt.strategy';
import { EmailAdapter } from 'src/application/services/email.adapter';
import { StubEmailAdapter } from 'src/infra/adapters/stub-email.adapter';
import { LoginController } from 'src/presentation/controllers/auth/login.controller';
import { ForgotPasswordController } from 'src/presentation/controllers/auth/forgot-password.controller';
import { ResetPasswordController } from 'src/presentation/controllers/auth/reset-password.controller';

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
    ForgotPasswordUsecase,
    ResetPasswordUsecase,
    StubEmailAdapter,
    {
      provide: EmailAdapter,
      useExisting: StubEmailAdapter,
    },
    JwtStrategy,
    PrismaUserRepository,
    PrismaPasswordResetTokenRepository,
    {
      provide: UserRepository,
      useExisting: PrismaUserRepository,
    },
    {
      provide: PasswordResetTokenRepository,
      useExisting: PrismaPasswordResetTokenRepository,
    },
  ],
  controllers: [LoginController, ForgotPasswordController, ResetPasswordController],
})
export class AuthModule {}
