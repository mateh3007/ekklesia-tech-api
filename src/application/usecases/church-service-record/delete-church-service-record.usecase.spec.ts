import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { DeleteChurchServiceRecordUsecase } from './delete-church-service-record.usecase';

const mockChurchServiceRecordRepository = {
  findById: jest.fn(),
  softDelete: jest.fn(),
};

describe('DeleteChurchServiceRecordUsecase', () => {
  let usecase: DeleteChurchServiceRecordUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new DeleteChurchServiceRecordUsecase(
      mockChurchServiceRecordRepository as any,
    );
  });

  it('should soft delete record when found and belongs to the church', async () => {
    mockChurchServiceRecordRepository.findById.mockResolvedValue({
      id: 'rid',
      churchId: 'cid',
    });
    mockChurchServiceRecordRepository.softDelete.mockResolvedValue(undefined);

    await usecase.execute('rid', 'cid');

    expect(mockChurchServiceRecordRepository.softDelete).toHaveBeenCalledWith(
      'rid',
    );
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
