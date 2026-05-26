import { Module } from '@nestjs/common';
import { CreateMemberUsecase } from 'src/application/usecases/member/create-member.usecase';
import { DeleteMemberUsecase } from 'src/application/usecases/member/delete-member.usecase';
import { GetAllMembersUsecase } from 'src/application/usecases/member/get-all-members.usecase';
import { GetMemberByIdUsecase } from 'src/application/usecases/member/get-member-by-id.usecase';
import { UpdateMemberUsecase } from 'src/application/usecases/member/update-member.usecase';
import { MemberRepository } from 'src/domain/repositories/member.repository';
import { PrismaMemberRepository } from 'src/infra/repositories/prisma-member.repository';
import { CreateMemberController } from 'src/presentation/controllers/member/create-member.controller';
import { DeleteMemberController } from 'src/presentation/controllers/member/delete-member.controller';
import { GetAllMembersController } from 'src/presentation/controllers/member/get-all-members.controller';
import { GetMemberByIdController } from 'src/presentation/controllers/member/get-member-by-id.controller';
import { UpdateMemberController } from 'src/presentation/controllers/member/update-member.controller';

@Module({
  providers: [
    CreateMemberUsecase,
    GetAllMembersUsecase,
    GetMemberByIdUsecase,
    UpdateMemberUsecase,
    DeleteMemberUsecase,
    PrismaMemberRepository,
    {
      provide: MemberRepository,
      useExisting: PrismaMemberRepository,
    },
  ],
  controllers: [
    CreateMemberController,
    GetAllMembersController,
    GetMemberByIdController,
    UpdateMemberController,
    DeleteMemberController,
  ],
})
export class MemberModule {}
