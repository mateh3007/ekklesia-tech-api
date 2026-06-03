import { Injectable } from '@nestjs/common';
import { IMember } from 'src/domain/entities/member.entity';
import { MemberRepository } from 'src/domain/repositories/member.repository';

@Injectable()
export class GetAllMembersUsecase {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(churchId: string): Promise<IMember[]> {
    return this.memberRepository.findByChurchId(churchId);
  }
}
