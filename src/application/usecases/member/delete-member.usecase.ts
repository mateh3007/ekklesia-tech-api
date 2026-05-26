import { ForbiddenException, Injectable } from '@nestjs/common';
import { MemberRepository } from 'src/domain/repositories/member.repository';

@Injectable()
export class DeleteMemberUsecase {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(id: string, churchId: string): Promise<void> {
    const member = await this.memberRepository.findById(id);
    if (member.churchId !== churchId) throw new ForbiddenException('Access denied to this member');
    await this.memberRepository.delete(id);
  }
}
