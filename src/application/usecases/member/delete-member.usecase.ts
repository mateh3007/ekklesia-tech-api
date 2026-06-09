import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { MemberRepository } from 'src/domain/repositories/member.repository';
import { CacheKeys } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class DeleteMemberUsecase {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(id: string, churchId: string): Promise<void> {
    const member = await this.memberRepository.findById(id);
    if (!member) throw new NotFoundException('Member not found');
    if (member.churchId !== churchId)
      throw new ForbiddenException('Access denied to this member');
    await this.memberRepository.delete(id);
    await Promise.all([
      this.cache.delete(CacheKeys.members(churchId)),
      this.cache.deleteByPattern(CacheKeys.agendaPattern(churchId)),
    ]);
  }
}
