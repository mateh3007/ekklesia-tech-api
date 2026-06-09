import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdatePrayerRequestUsecase } from './update-prayer-request.usecase';

const mockPrayerRequestRepository = {
  findById: jest.fn(),
  update: jest.fn(),
};

const mockCacheAdapter = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  deleteByPattern: jest.fn().mockResolvedValue(undefined),
};

describe('UpdatePrayerRequestUsecase', () => {
  let usecase: UpdatePrayerRequestUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new UpdatePrayerRequestUsecase(
      mockPrayerRequestRepository as any,
      mockCacheAdapter,
    );
  });

  it('should update prayer request successfully', async () => {
    const pr = {
      id: 'prid',
      churchId: 'cid',
      name: 'João',
      request: 'Original',
    };
    const updated = { ...pr, request: 'Atualizado' };
    mockPrayerRequestRepository.findById.mockResolvedValue(pr);
    mockPrayerRequestRepository.update.mockResolvedValue(updated);

    const result = await usecase.execute(
      'prid',
      { request: 'Atualizado' },
      'cid',
    );

    expect(result).toBe(updated);
    expect(mockPrayerRequestRepository.update).toHaveBeenCalledWith('prid', {
      request: 'Atualizado',
    });
  });

  it('should throw NotFoundException when prayer request does not exist', async () => {
    mockPrayerRequestRepository.findById.mockResolvedValue(null);

    await expect(usecase.execute('prid', {}, 'cid')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw ForbiddenException when prayer request belongs to a different church', async () => {
    mockPrayerRequestRepository.findById.mockResolvedValue({
      id: 'prid',
      churchId: 'other-cid',
    });

    await expect(usecase.execute('prid', {}, 'cid')).rejects.toThrow(
      ForbiddenException,
    );
  });
});
