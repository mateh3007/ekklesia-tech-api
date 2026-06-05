import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { DeletePrayerRequestUsecase } from './delete-prayer-request.usecase';

const mockPrayerRequestRepository = {
  findById: jest.fn(),
  softDelete: jest.fn(),
};

describe('DeletePrayerRequestUsecase', () => {
  let usecase: DeletePrayerRequestUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new DeletePrayerRequestUsecase(mockPrayerRequestRepository as any);
  });

  it('should soft delete prayer request when found and belongs to the church', async () => {
    mockPrayerRequestRepository.findById.mockResolvedValue({ id: 'prid', churchId: 'cid' });
    mockPrayerRequestRepository.softDelete.mockResolvedValue(undefined);

    await usecase.execute('prid', 'cid');

    expect(mockPrayerRequestRepository.softDelete).toHaveBeenCalledWith('prid');
  });

  it('should throw NotFoundException when prayer request does not exist', async () => {
    mockPrayerRequestRepository.findById.mockResolvedValue(null);

    await expect(usecase.execute('prid', 'cid')).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException when prayer request belongs to a different church', async () => {
    mockPrayerRequestRepository.findById.mockResolvedValue({ id: 'prid', churchId: 'other-cid' });

    await expect(usecase.execute('prid', 'cid')).rejects.toThrow(ForbiddenException);
  });
});
