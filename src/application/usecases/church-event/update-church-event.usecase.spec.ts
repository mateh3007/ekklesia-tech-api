import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateChurchEventUsecase } from './update-church-event.usecase';

const mockChurchEventRepository = {
  findById: jest.fn(),
  update: jest.fn(),
};

describe('UpdateChurchEventUsecase', () => {
  let usecase: UpdateChurchEventUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new UpdateChurchEventUsecase(mockChurchEventRepository as any);
  });

  it('should update event successfully', async () => {
    const event = { id: 'eid', churchId: 'cid', title: 'Retiro' };
    const updated = { ...event, title: 'Retiro Atualizado' };
    mockChurchEventRepository.findById.mockResolvedValue(event);
    mockChurchEventRepository.update.mockResolvedValue(updated);

    const result = await usecase.execute('eid', { title: 'Retiro Atualizado' }, 'cid');

    expect(result).toBe(updated);
  });

  it('should throw NotFoundException when event does not exist', async () => {
    mockChurchEventRepository.findById.mockResolvedValue(null);

    await expect(usecase.execute('eid', {}, 'cid')).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException when event belongs to a different church', async () => {
    mockChurchEventRepository.findById.mockResolvedValue({ id: 'eid', churchId: 'other-cid' });

    await expect(usecase.execute('eid', {}, 'cid')).rejects.toThrow(ForbiddenException);
  });
});
