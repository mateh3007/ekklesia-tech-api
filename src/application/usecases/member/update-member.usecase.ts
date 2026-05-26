import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { IMember } from 'src/domain/entities/member.entity';
import { MemberRepository, UpdateMemberInput } from 'src/domain/repositories/member.repository';

@Injectable()
export class UpdateMemberUsecase {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(id: string, data: UpdateMemberInput, churchId: string): Promise<IMember> {
    const member = await this.memberRepository.findById(id);
    if (!member) throw new NotFoundException('Member not found');
    if (member.churchId !== churchId) throw new ForbiddenException('Access denied to this member');
    return this.memberRepository.update(id, data);
  }
}
