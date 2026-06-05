import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateChurchServiceRecordUsecase } from './update-church-service-record.usecase';

const mockChurchServiceRecordRepository = {
  findById: jest.fn(),
  update: jest.fn(),
};

describe('UpdateChurchServiceRecordUsecase', () => {
  let usecase: UpdateChurchServiceRecordUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new UpdateChurchServiceRecordUsecase(mockChurchServiceRecordRepository as any);
  });

  it('should update record successfully', async () => {
    const record = { id: 'rid', churchId: 'cid', preacher: 'Pastor' };
    const updated = { ...record, preacher: 'Pastor Atualizado' };
    mockChurchServiceRecordRepository.findById.mockResolvedValue(record);
    mockChurchServiceRecordRepository.update.mockResolvedValue(updated);

    const result = await usecase.execute('rid', { preacher: 'Pastor Atualizado' }, 'cid');

    expect(result).toBe(updated);
    expect(mockChurchServiceRecordRepository.update).toHaveBeenCalledWith('rid', { preacher: 'Pastor Atualizado' });
  });

  it('should throw NotFoundException when record does not exist', async () => {
    mockChurchServiceRecordRepository.findById.mockResolvedValue(null);

    await expect(usecase.execute('rid', {}, 'cid')).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException when record belongs to a different church', async () => {
    mockChurchServiceRecordRepository.findById.mockResolvedValue({ id: 'rid', churchId: 'other-cid' });

    await expect(usecase.execute('rid', {}, 'cid')).rejects.toThrow(ForbiddenException);
  });
});
