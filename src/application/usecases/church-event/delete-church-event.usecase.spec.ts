import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { DeleteChurchEventUsecase } from './delete-church-event.usecase';

const mockChurchEventRepository = {
  findById: jest.fn(),
  delete: jest.fn(),
};


const mockCacheAdapter = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  deleteByPattern: jest.fn().mockResolvedValue(undefined),
};

describe('DeleteChurchEventUsecase', () => {
  let usecase: DeleteChurchEventUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new DeleteChurchEventUsecase(mockChurchEventRepository as any, mockCacheAdapter as any);
  });

  it('should delete event when found and belongs to the church', async () => {
    mockChurchEventRepository.findById.mockResolvedValue({
      id: 'eid',
      churchId: 'cid',
    });
    mockChurchEventRepository.delete.mockResolvedValue(undefined);

    await usecase.execute('eid', 'cid');

    expect(mockChurchEventRepository.delete).toHaveBeenCalledWith('eid');
  });

  it('should throw NotFoundException when event does not exist', async () => {
    mockChurchEventRepository.findById.mockResolvedValue(null);

    await expect(usecase.execute('eid', 'cid')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw ForbiddenException when event belongs to a different church', async () => {
    mockChurchEventRepository.findById.mockResolvedValue({
      id: 'eid',
      churchId: 'other-cid',
    });

    await expect(usecase.execute('eid', 'cid')).rejects.toThrow(
      ForbiddenException,
    );
  });
});
