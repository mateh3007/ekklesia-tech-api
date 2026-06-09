import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { DeleteUserUsecase } from './delete-user.usecase';

const mockUserRepository = {
  findById: jest.fn(),
  delete: jest.fn(),
};


const mockCacheAdapter = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  deleteByPattern: jest.fn().mockResolvedValue(undefined),
};

describe('DeleteUserUsecase', () => {
  let usecase: DeleteUserUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new DeleteUserUsecase(mockUserRepository as any, mockCacheAdapter as any);
  });

  it('should delete user when found and belongs to the church', async () => {
    const user = { id: 'uid', churchId: 'cid' };
    mockUserRepository.findById.mockResolvedValue(user);
    mockUserRepository.delete.mockResolvedValue(undefined);

    await usecase.execute('uid', 'cid');

    expect(mockUserRepository.delete).toHaveBeenCalledWith('uid');
  });

  it('should throw NotFoundException when user does not exist', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(usecase.execute('uid', 'cid')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw ForbiddenException when user belongs to a different church', async () => {
    mockUserRepository.findById.mockResolvedValue({
      id: 'uid',
      churchId: 'other-cid',
    });

    await expect(usecase.execute('uid', 'cid')).rejects.toThrow(
      ForbiddenException,
    );
  });
});
