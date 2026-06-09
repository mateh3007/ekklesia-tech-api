import { NotFoundException } from '@nestjs/common';
import { GetChurchProfileUsecase } from './get-church-profile.usecase';

const mockChurchProfileRepository = {
  findByChurchId: jest.fn(),
};

const mockCacheAdapter = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  deleteByPattern: jest.fn().mockResolvedValue(undefined),
};

describe('GetChurchProfileUsecase', () => {
  let usecase: GetChurchProfileUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new GetChurchProfileUsecase(
      mockChurchProfileRepository as any,
      mockCacheAdapter,
    );
  });

  it('should return church profile when found', async () => {
    const profile = { id: 'pid', churchId: 'cid', name: 'Igreja' };
    mockChurchProfileRepository.findByChurchId.mockResolvedValue(profile);

    const result = await usecase.execute('cid');

    expect(result).toBe(profile);
  });

  it('should throw NotFoundException when profile does not exist', async () => {
    mockChurchProfileRepository.findByChurchId.mockResolvedValue(null);

    await expect(usecase.execute('cid')).rejects.toThrow(NotFoundException);
  });
});
