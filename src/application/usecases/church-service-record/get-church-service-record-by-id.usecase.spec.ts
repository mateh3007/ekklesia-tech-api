import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { GetChurchServiceRecordByIdUsecase } from './get-church-service-record-by-id.usecase';

const mockChurchServiceRecordRepository = {
  findById: jest.fn(),
};

describe('GetChurchServiceRecordByIdUsecase', () => {
  let usecase: GetChurchServiceRecordByIdUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new GetChurchServiceRecordByIdUsecase(
      mockChurchServiceRecordRepository as any,
    );
  });

  it('should return record when found and belongs to the church', async () => {
    const record = { id: 'rid', churchId: 'cid', preacher: 'Pastor' };
    mockChurchServiceRecordRepository.findById.mockResolvedValue(record);

    const result = await usecase.execute('rid', 'cid');

    expect(result).toBe(record);
  });

  it('should throw NotFoundException when record does not exist', async () => {
    mockChurchServiceRecordRepository.findById.mockResolvedValue(null);

    await expect(usecase.execute('rid', 'cid')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw ForbiddenException when record belongs to a different church', async () => {
    mockChurchServiceRecordRepository.findById.mockResolvedValue({
      id: 'rid',
      churchId: 'other-cid',
    });

    await expect(usecase.execute('rid', 'cid')).rejects.toThrow(
      ForbiddenException,
    );
  });
});
