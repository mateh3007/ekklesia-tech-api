import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { IMember } from 'src/domain/entities/member.entity';
import { MemberRepository } from 'src/domain/repositories/member.repository';

@Injectable()
export class GetMemberByIdUsecase {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(id: string, churchId: string): Promise<IMember> {
    const member = await this.memberRepository.findById(id);
    if (!member) throw new NotFoundException('Member not found');
    if (member.churchId !== churchId) throw new ForbiddenException('Access denied to this member');
    return member;
  }
}
