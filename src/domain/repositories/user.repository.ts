import { BaseRepository } from '../base/base.repository';
import { IUser } from '../entities/user.entity';
import { Role } from '../enums/role.enum';
import { PaginatedResult } from '../types/paginated-result.type';

export type CreateUserInput = Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserInput = Partial<
  Pick<IUser, 'name' | 'email' | 'phone' | 'password'>
>;
export type IUserResponse = Omit<IUser, 'password'>;

export abstract class UserRepository extends BaseRepository<
  IUserResponse,
  CreateUserInput,
  UpdateUserInput
> {
  abstract findByEmail(email: string): Promise<IUser | null>;
  abstract findByChurchId(churchId: string): Promise<IUserResponse[]>;
  abstract findByChurchIdAndRoles(
    churchId: string,
    roles: Role[],
  ): Promise<IUserResponse[]>;
  abstract findByChurchIdPaginated(
    churchId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<IUserResponse>>;
  abstract updatePassword(id: string, hashedPassword: string): Promise<void>;
}
