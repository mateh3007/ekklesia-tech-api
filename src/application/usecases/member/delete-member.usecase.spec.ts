import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { DeleteMemberUsecase } from './delete-member.usecase';

const mockMemberRepository = {
  findById: jest.fn(),
  delete: jest.fn(),
};


const mockCacheAdapter = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  deleteByPattern: jest.fn().mockResolvedValue(undefined),
};

describe('DeleteMemberUsecase', () => {
  let usecase: DeleteMemberUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new DeleteMemberUsecase(mockMemberRepository as any, mockCacheAdapter as any);
  });

  it('should delete member when found and belongs to the church', async () => {
    mockMemberRepository.findById.mockResolvedValue({
      id: 'mid',
      churchId: 'cid',
    });
    mockMemberRepository.delete.mockResolvedValue(undefined);

    await usecase.execute('mid', 'cid');

    expect(mockMemberRepository.delete).toHaveBeenCalledWith('mid');
  });

  it('should throw NotFoundException when member does not exist', async () => {
    mockMemberRepository.findById.mockResolvedValue(null);

    await expect(usecase.execute('mid', 'cid')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw ForbiddenException when member belongs to a different church', async () => {
    mockMemberRepository.findById.mockResolvedValue({
      id: 'mid',
      churchId: 'other-cid',
    });

    await expect(usecase.execute('mid', 'cid')).rejects.toThrow(
      ForbiddenException,
    );
  });
});
