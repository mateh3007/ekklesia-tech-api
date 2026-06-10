import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PixKeyType } from 'src/domain/enums/pix-key-type.enum';
import { UpdateChurchProfileUsecase } from './update-church-profile.usecase';

const mockChurchProfileRepository = {
  findByChurchId: jest.fn(),
  update: jest.fn(),
};

const mockCacheAdapter = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  deleteByPattern: jest.fn().mockResolvedValue(undefined),
};

describe('UpdateChurchProfileUsecase', () => {
  let usecase: UpdateChurchProfileUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new UpdateChurchProfileUsecase(
      mockChurchProfileRepository as any,
      mockCacheAdapter,
    );
  });

  it('should update church profile successfully', async () => {
    const profile = { id: 'pid', churchId: 'cid', name: 'Igreja' };
    const updated = { ...profile, name: 'Igreja Atualizada' };
    mockChurchProfileRepository.findByChurchId.mockResolvedValue(profile);
    mockChurchProfileRepository.update.mockResolvedValue(updated);

    const result = await usecase.execute('cid', { name: 'Igreja Atualizada' });

    expect(result).toBe(updated);
    expect(mockChurchProfileRepository.update).toHaveBeenCalledWith('cid', {
      name: 'Igreja Atualizada',
    });
  });

  it('should throw NotFoundException when profile does not exist', async () => {
    mockChurchProfileRepository.findByChurchId.mockResolvedValue(null);

    await expect(usecase.execute('cid', {})).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException when pixKeyType is provided without pixKey', async () => {
    await expect(
      usecase.execute('cid', { pixKeyType: PixKeyType.CPF }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should update successfully when both pixKeyType and pixKey are provided', async () => {
    const profile = { id: 'pid', churchId: 'cid' };
    const updated = {
      ...profile,
      pixKeyType: PixKeyType.CPF,
      pixKey: '123.456.789-00',
    };
    mockChurchProfileRepository.findByChurchId.mockResolvedValue(profile);
    mockChurchProfileRepository.update.mockResolvedValue(updated);

    const result = await usecase.execute('cid', {
      pixKeyType: PixKeyType.CPF,
      pixKey: '123.456.789-00',
    });

    expect(result).toBe(updated);
  });
});
