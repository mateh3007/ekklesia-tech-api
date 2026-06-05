import { NotFoundException } from '@nestjs/common';
import { GetMyChurchUsecase } from './get-my-church.usecase';

const mockChurchRepository = {
  findById: jest.fn(),
};

const mockUserRepository = {
  findByChurchId: jest.fn(),
};

describe('GetMyChurchUsecase', () => {
  let usecase: GetMyChurchUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new GetMyChurchUsecase(mockChurchRepository as any, mockUserRepository as any);
  });

  it('should return church with its users', async () => {
    const church = { id: 'cid', corporateName: 'Igreja' };
    const users = [{ id: 'u1' }, { id: 'u2' }];
    mockChurchRepository.findById.mockResolvedValue(church);
    mockUserRepository.findByChurchId.mockResolvedValue(users);

    const result = await usecase.execute('cid');

    expect(result).toEqual({ ...church, users });
  });

  it('should throw NotFoundException when church does not exist', async () => {
    mockChurchRepository.findById.mockResolvedValue(null);

    await expect(usecase.execute('cid')).rejects.toThrow(NotFoundException);
  });
});
