import { Injectable } from '@nestjs/common';
import { IMember } from 'src/domain/entities/member.entity';
import { MemberRepository } from 'src/domain/repositories/member.repository';

type CreateMemberBody = {
  name: string;
  phone?: string;
  dateOfBirth: Date;
};

@Injectable()
export class CreateMemberUsecase {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(input: CreateMemberBody, churchId: string): Promise<IMember> {
    return this.memberRepository.create({ ...input, churchId });
  }
}
