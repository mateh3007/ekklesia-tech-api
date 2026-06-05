import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { GetMemberByIdUsecase } from './get-member-by-id.usecase';

const mockMemberRepository = {
  findById: jest.fn(),
};

describe('GetMemberByIdUsecase', () => {
  let usecase: GetMemberByIdUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new GetMemberByIdUsecase(mockMemberRepository as any);
  });

  it('should return member when found and belongs to the church', async () => {
    const member = { id: 'mid', churchId: 'cid', name: 'João' };
    mockMemberRepository.findById.mockResolvedValue(member);

    const result = await usecase.execute('mid', 'cid');

    expect(result).toBe(member);
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
