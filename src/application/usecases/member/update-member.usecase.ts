import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CacheAdapter } from 'src/domain/adapter/cache.adapter';
import { IMember } from 'src/domain/entities/member.entity';
import {
  MemberRepository,
  UpdateMemberInput,
} from 'src/domain/repositories/member.repository';
import { CacheKeys } from 'src/infra/adapters/cache-key.util';

@Injectable()
export class UpdateMemberUsecase {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly cache: CacheAdapter,
  ) {}

  async execute(
    id: string,
    data: UpdateMemberInput,
    churchId: string,
  ): Promise<IMember> {
    const member = await this.memberRepository.findById(id);
    if (!member) throw new NotFoundException('Member not found');
    if (member.churchId !== churchId)
      throw new ForbiddenException('Access denied to this member');

    const updated = await this.memberRepository.update(id, data);
    await Promise.all([
      this.cache.deleteByPattern(CacheKeys.membersPattern(churchId)),
      this.cache.deleteByPattern(CacheKeys.agendaPattern(churchId)),
    ]);
    return updated;
  }
}
