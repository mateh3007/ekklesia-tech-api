import { NotFoundException } from '@nestjs/common';
import { GetChurchByIdUsecase } from './get-church-by-id.usecase';

const mockChurchRepository = {
  findById: jest.fn(),
};

describe('GetChurchByIdUsecase', () => {
  let usecase: GetChurchByIdUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new GetChurchByIdUsecase(mockChurchRepository as any);
  });

  it('should return church when found', async () => {
    const church = { id: 'cid', corporateName: 'Igreja Teste' };
    mockChurchRepository.findById.mockResolvedValue(church);

    const result = await usecase.execute('cid');

    expect(result).toBe(church);
  });

  it('should throw NotFoundException when church does not exist', async () => {
    mockChurchRepository.findById.mockResolvedValue(null);

    await expect(usecase.execute('cid')).rejects.toThrow(NotFoundException);
  });
});
