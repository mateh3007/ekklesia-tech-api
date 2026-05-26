import { BaseRepository } from '../base/base.repository';
import { IMember } from '../entities/member.entity';

export type CreateMemberInput = Omit<IMember, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateMemberInput = Partial<Pick<IMember, 'name' | 'phone' | 'dateOfBirth'>>;

export abstract class MemberRepository extends BaseRepository<IMember, CreateMemberInput, UpdateMemberInput> {
  abstract findByChurchId(churchId: string): Promise<IMember[]>;
}
