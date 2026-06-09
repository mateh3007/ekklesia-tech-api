import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { DeleteChurchServiceUsecase } from './delete-church-service.usecase';

const mockChurchServiceRepository = {
  findById: jest.fn(),
  delete: jest.fn(),
};

const mockCacheAdapter = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  deleteByPattern: jest.fn().mockResolvedValue(undefined),
};

describe('DeleteChurchServiceUsecase', () => {
  let usecase: DeleteChurchServiceUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new DeleteChurchServiceUsecase(
      mockChurchServiceRepository as any,
      mockCacheAdapter,
    );
  });

  it('should delete church service when found and belongs to the church', async () => {
    mockChurchServiceRepository.findById.mockResolvedValue({
      id: 'sid',
      churchId: 'cid',
    });
    mockChurchServiceRepository.delete.mockResolvedValue(undefined);

    await usecase.execute('sid', 'cid');

    expect(mockChurchServiceRepository.delete).toHaveBeenCalledWith('sid');
  });

  it('should throw NotFoundException when service does not exist', async () => {
    mockChurchServiceRepository.findById.mockResolvedValue(null);

    await expect(usecase.execute('sid', 'cid')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw ForbiddenException when service belongs to a different church', async () => {
    mockChurchServiceRepository.findById.mockResolvedValue({
      id: 'sid',
      churchId: 'other-cid',
    });

    await expect(usecase.execute('sid', 'cid')).rejects.toThrow(
      ForbiddenException,
    );
  });
});
