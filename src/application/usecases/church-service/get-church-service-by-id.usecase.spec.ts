import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { GetChurchServiceByIdUsecase } from './get-church-service-by-id.usecase';

const mockChurchServiceRepository = {
  findById: jest.fn(),
};

describe('GetChurchServiceByIdUsecase', () => {
  let usecase: GetChurchServiceByIdUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new GetChurchServiceByIdUsecase(mockChurchServiceRepository as any);
  });

  it('should return service when found and belongs to the church', async () => {
    const service = { id: 'sid', churchId: 'cid', title: 'Culto' };
    mockChurchServiceRepository.findById.mockResolvedValue(service);

    const result = await usecase.execute('sid', 'cid');

    expect(result).toBe(service);
  });

  it('should throw NotFoundException when service does not exist', async () => {
    mockChurchServiceRepository.findById.mockResolvedValue(null);

    await expect(usecase.execute('sid', 'cid')).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException when service belongs to a different church', async () => {
    mockChurchServiceRepository.findById.mockResolvedValue({ id: 'sid', churchId: 'other-cid' });

    await expect(usecase.execute('sid', 'cid')).rejects.toThrow(ForbiddenException);
  });
});
