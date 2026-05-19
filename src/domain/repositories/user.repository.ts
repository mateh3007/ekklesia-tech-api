import { BaseRepository } from '../base/base.repository';
import { IUser } from '../entities/user.entity';

export type CreateUserInput = Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserInput = Partial<Pick<IUser, 'name' | 'email' | 'phone' | 'password'>>;
export type IUserResponse = Omit<IUser, 'password'>;

export abstract class UserRepository extends BaseRepository<IUserResponse, CreateUserInput, UpdateUserInput> {
  abstract findByEmail(email: string): Promise<IUser | null>;
}
