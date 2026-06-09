import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { GetUserByIdUsecase } from './get-user-by-id.usecase';

const mockUserRepository = {
  findById: jest.fn(),
};

const makeUser = (churchId = 'church-id') => ({
  id: 'user-id',
  name: 'User',
  email: 'u@u.com',
  churchId,
});

const mockCacheAdapter = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  deleteByPattern: jest.fn().mockResolvedValue(undefined),
};

describe('GetUserByIdUsecase', () => {
  let usecase: GetUserByIdUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new GetUserByIdUsecase(
      mockUserRepository as any,
      mockCacheAdapter,
    );
  });

  it('should return user when found and belongs to the church', async () => {
    const user = makeUser('church-id');
    mockUserRepository.findById.mockResolvedValue(user);

    const result = await usecase.execute('user-id', 'church-id');

    expect(result).toBe(user);
  });

  it('should throw NotFoundException when user does not exist', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(usecase.execute('uid', 'cid')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw ForbiddenException when user belongs to a different church', async () => {
    mockUserRepository.findById.mockResolvedValue(makeUser('other-church'));

    await expect(usecase.execute('uid', 'church-id')).rejects.toThrow(
      ForbiddenException,
    );
  });
});
