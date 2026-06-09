import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateMemberUsecase } from './update-member.usecase';

const mockMemberRepository = {
  findById: jest.fn(),
  update: jest.fn(),
};

const mockCacheAdapter = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  deleteByPattern: jest.fn().mockResolvedValue(undefined),
};

describe('UpdateMemberUsecase', () => {
  let usecase: UpdateMemberUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new UpdateMemberUsecase(
      mockMemberRepository as any,
      mockCacheAdapter,
    );
  });

  it('should update member successfully', async () => {
    const member = { id: 'mid', churchId: 'cid', name: 'João' };
    const updated = { ...member, name: 'João Silva' };
    mockMemberRepository.findById.mockResolvedValue(member);
    mockMemberRepository.update.mockResolvedValue(updated);

    const result = await usecase.execute('mid', { name: 'João Silva' }, 'cid');

    expect(result).toBe(updated);
    expect(mockMemberRepository.update).toHaveBeenCalledWith('mid', {
      name: 'João Silva',
    });
  });

  it('should throw NotFoundException when member does not exist', async () => {
    mockMemberRepository.findById.mockResolvedValue(null);

    await expect(usecase.execute('mid', {}, 'cid')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw ForbiddenException when member belongs to a different church', async () => {
    mockMemberRepository.findById.mockResolvedValue({
      id: 'mid',
      churchId: 'other-cid',
    });

    await expect(usecase.execute('mid', {}, 'cid')).rejects.toThrow(
      ForbiddenException,
    );
  });
});
