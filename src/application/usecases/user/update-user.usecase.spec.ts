import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserUsecase } from './update-user.usecase';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('new-hashed'),
}));

const mockUserRepository = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
  update: jest.fn(),
};

const makeUser = (id = 'user-id', churchId = 'church-id') => ({
  id,
  name: 'User',
  email: 'user@test.com',
  churchId,
});

describe('UpdateUserUsecase', () => {
  let usecase: UpdateUserUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new UpdateUserUsecase(mockUserRepository as any);
  });

  it('should update user successfully without changing email or password', async () => {
    const user = makeUser();
    const updated = { ...user, name: 'New Name' };
    mockUserRepository.findById.mockResolvedValue(user);
    mockUserRepository.update.mockResolvedValue(updated);

    const result = await usecase.execute(
      'user-id',
      { name: 'New Name' },
      'church-id',
    );

    expect(result).toBe(updated);
    expect(mockUserRepository.update).toHaveBeenCalledWith('user-id', {
      name: 'New Name',
    });
  });

  it('should hash password when it is included in update', async () => {
    const user = makeUser();
    mockUserRepository.findById.mockResolvedValue(user);
    mockUserRepository.update.mockResolvedValue(user);

    await usecase.execute('user-id', { password: 'plain-pass' }, 'church-id');

    expect(mockUserRepository.update).toHaveBeenCalledWith(
      'user-id',
      expect.objectContaining({ password: 'new-hashed' }),
    );
  });

  it('should allow updating email when new email is not in use', async () => {
    const user = makeUser();
    mockUserRepository.findById.mockResolvedValue(user);
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.update.mockResolvedValue({
      ...user,
      email: 'new@test.com',
    });

    const result = await usecase.execute(
      'user-id',
      { email: 'new@test.com' },
      'church-id',
    );

    expect(result).toBeDefined();
  });

  it('should allow updating email to the same email (same user)', async () => {
    const user = makeUser();
    mockUserRepository.findById.mockResolvedValue(user);
    mockUserRepository.findByEmail.mockResolvedValue(user);
    mockUserRepository.update.mockResolvedValue(user);

    await expect(
      usecase.execute('user-id', { email: 'user@test.com' }, 'church-id'),
    ).resolves.toBeDefined();
  });

  it('should throw NotFoundException when user does not exist', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(usecase.execute('uid', {}, 'cid')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw ForbiddenException when user belongs to different church', async () => {
    mockUserRepository.findById.mockResolvedValue(
      makeUser('user-id', 'other-church'),
    );

    await expect(usecase.execute('user-id', {}, 'church-id')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should throw ConflictException when new email is already in use by another user', async () => {
    const user = makeUser();
    mockUserRepository.findById.mockResolvedValue(user);
    mockUserRepository.findByEmail.mockResolvedValue({
      id: 'other-user-id',
      email: 'taken@test.com',
    });

    await expect(
      usecase.execute('user-id', { email: 'taken@test.com' }, 'church-id'),
    ).rejects.toThrow(ConflictException);
  });
});
