import { NotFoundException } from '@nestjs/common';
import { GetMeUsecase } from './get-me.usecase';

const mockUserRepository = {
  findById: jest.fn(),
};

describe('GetMeUsecase', () => {
  let usecase: GetMeUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new GetMeUsecase(mockUserRepository as any);
  });

  it('should return the authenticated user', async () => {
    const user = { id: 'uid', name: 'User', email: 'u@u.com', churchId: 'cid' };
    mockUserRepository.findById.mockResolvedValue(user);

    const result = await usecase.execute('uid');

    expect(result).toBe(user);
    expect(mockUserRepository.findById).toHaveBeenCalledWith('uid');
  });

  it('should throw NotFoundException when user is not found', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(usecase.execute('nonexistent')).rejects.toThrow(NotFoundException);
  });
});
