import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { GetChurchEventByIdUsecase } from './get-church-event-by-id.usecase';

const mockChurchEventRepository = {
  findById: jest.fn(),
};

describe('GetChurchEventByIdUsecase', () => {
  let usecase: GetChurchEventByIdUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new GetChurchEventByIdUsecase(mockChurchEventRepository as any);
  });

  it('should return event when found and belongs to the church', async () => {
    const event = { id: 'eid', churchId: 'cid', title: 'Retiro' };
    mockChurchEventRepository.findById.mockResolvedValue(event);

    const result = await usecase.execute('eid', 'cid');

    expect(result).toBe(event);
  });

  it('should throw NotFoundException when event does not exist', async () => {
    mockChurchEventRepository.findById.mockResolvedValue(null);

    await expect(usecase.execute('eid', 'cid')).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException when event belongs to a different church', async () => {
    mockChurchEventRepository.findById.mockResolvedValue({ id: 'eid', churchId: 'other-cid' });

    await expect(usecase.execute('eid', 'cid')).rejects.toThrow(ForbiddenException);
  });
});
