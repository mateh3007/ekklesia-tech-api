import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { GetPrayerRequestByIdUsecase } from './get-prayer-request-by-id.usecase';

const mockPrayerRequestRepository = {
  findById: jest.fn(),
};

describe('GetPrayerRequestByIdUsecase', () => {
  let usecase: GetPrayerRequestByIdUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new GetPrayerRequestByIdUsecase(
      mockPrayerRequestRepository as any,
    );
  });

  it('should return prayer request when found and belongs to the church', async () => {
    const request = {
      id: 'prid',
      churchId: 'cid',
      name: 'João',
      request: 'Pedido',
    };
    mockPrayerRequestRepository.findById.mockResolvedValue(request);

    const result = await usecase.execute('prid', 'cid');

    expect(result).toBe(request);
  });

  it('should throw NotFoundException when prayer request does not exist', async () => {
    mockPrayerRequestRepository.findById.mockResolvedValue(null);

    await expect(usecase.execute('prid', 'cid')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw ForbiddenException when prayer request belongs to a different church', async () => {
    mockPrayerRequestRepository.findById.mockResolvedValue({
      id: 'prid',
      churchId: 'other-cid',
    });

    await expect(usecase.execute('prid', 'cid')).rejects.toThrow(
      ForbiddenException,
    );
  });
});
