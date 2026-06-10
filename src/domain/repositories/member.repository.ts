import { BaseRepository } from '../base/base.repository';
import { IMember } from '../entities/member.entity';
import { PaginatedResult } from '../types/paginated-result.type';

export type CreateMemberInput = Omit<
  IMember,
  'id' | 'createdAt' | 'updatedAt' | 'dateOfBirth'
> & { dateOfBirth: Date };
export type UpdateMemberInput = Partial<
  Pick<IMember, 'name' | 'phone' | 'dateOfBirth'>
>;

export abstract class MemberRepository extends BaseRepository<
  IMember,
  CreateMemberInput,
  UpdateMemberInput
> {
  abstract findByChurchId(churchId: string): Promise<IMember[]>;
  abstract countByChurchId(churchId: string): Promise<number>;
}
