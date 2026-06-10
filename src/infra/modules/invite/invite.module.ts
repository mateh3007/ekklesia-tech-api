import { Module } from '@nestjs/common';
import { AcceptInviteUsecase } from 'src/application/usecases/invite/accept-invite.usecase';
import { CreateInviteUsecase } from 'src/application/usecases/invite/create-invite.usecase';
import { ValidateInviteUsecase } from 'src/application/usecases/invite/validate-invite.usecase';
import { EmailAdapter } from 'src/application/services/email.adapter';
import { ChurchInviteRepository } from 'src/domain/repositories/church-invite.repository';
import { ChurchRepository } from 'src/domain/repositories/church.repository';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { StubEmailAdapter } from 'src/infra/adapters/stub-email.adapter';
import { PrismaChurchInviteRepository } from 'src/infra/repositories/prisma-church-invite.repository';
import { PrismaChurchRepository } from 'src/infra/repositories/prisma-church.repository';
import { PrismaUserRepository } from 'src/infra/repositories/prisma-user.repository';
import { AcceptInviteController } from 'src/presentation/controllers/invite/accept-invite.controller';
import { CreateInviteController } from 'src/presentation/controllers/invite/create-invite.controller';
import { ValidateInviteController } from 'src/presentation/controllers/invite/validate-invite.controller';

@Module({
  providers: [
    CreateInviteUsecase,
    ValidateInviteUsecase,
    AcceptInviteUsecase,
    PrismaChurchInviteRepository,
    {
      provide: ChurchInviteRepository,
      useExisting: PrismaChurchInviteRepository,
    },
    PrismaUserRepository,
    { provide: UserRepository, useExisting: PrismaUserRepository },
    PrismaChurchRepository,
    { provide: ChurchRepository, useExisting: PrismaChurchRepository },
    StubEmailAdapter,
    { provide: EmailAdapter, useExisting: StubEmailAdapter },
  ],
  controllers: [
    CreateInviteController,
    ValidateInviteController,
    AcceptInviteController,
  ],
})
export class InviteModule {}
