import { NotFoundException } from '@nestjs/common';
import { DeleteChurchProfileUsecase } from './delete-church-profile.usecase';

const mockChurchProfileRepository = {
  findByChurchId: jest.fn(),
  softDelete: jest.fn(),
};

const mockCacheAdapter = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  deleteByPattern: jest.fn().mockResolvedValue(undefined),
};

describe('DeleteChurchProfileUsecase', () => {
  let usecase: DeleteChurchProfileUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new DeleteChurchProfileUsecase(
      mockChurchProfileRepository as any,
      mockCacheAdapter,
    );
  });

  it('should soft delete church profile when found', async () => {
    const profile = { id: 'pid', churchId: 'cid' };
    mockChurchProfileRepository.findByChurchId.mockResolvedValue(profile);
    mockChurchProfileRepository.softDelete.mockResolvedValue(undefined);

    await usecase.execute('cid');

    expect(mockChurchProfileRepository.softDelete).toHaveBeenCalledWith('cid');
  });

  it('should throw NotFoundException when profile does not exist', async () => {
    mockChurchProfileRepository.findByChurchId.mockResolvedValue(null);

    await expect(usecase.execute('cid')).rejects.toThrow(NotFoundException);
  });
});
