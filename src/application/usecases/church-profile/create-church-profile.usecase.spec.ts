import { ConflictException } from '@nestjs/common';
import { CreateChurchProfileUsecase } from './create-church-profile.usecase';

const mockChurchProfileRepository = {
  findByChurchIdIncludingDeleted: jest.fn(),
  create: jest.fn(),
};

const makeInput = () => ({
  churchId: 'church-id',
  name: 'Igreja Teste',
});

describe('CreateChurchProfileUsecase', () => {
  let usecase: CreateChurchProfileUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new CreateChurchProfileUsecase(mockChurchProfileRepository as any);
  });

  it('should create church profile when none exists', async () => {
    const profile = { id: 'pid', ...makeInput() };
    mockChurchProfileRepository.findByChurchIdIncludingDeleted.mockResolvedValue(null);
    mockChurchProfileRepository.create.mockResolvedValue(profile);

    const result = await usecase.execute(makeInput() as any);

    expect(result).toBe(profile);
    expect(mockChurchProfileRepository.create).toHaveBeenCalled();
  });

  it('should create church profile when previous one was soft-deleted', async () => {
    const deletedProfile = { id: 'pid', deletedAt: new Date() };
    const newProfile = { id: 'pid2', ...makeInput() };
    mockChurchProfileRepository.findByChurchIdIncludingDeleted.mockResolvedValue(deletedProfile);
    mockChurchProfileRepository.create.mockResolvedValue(newProfile);

    const result = await usecase.execute(makeInput() as any);

    expect(result).toBe(newProfile);
  });

  it('should throw ConflictException when active profile already exists', async () => {
    const activeProfile = { id: 'pid', deletedAt: undefined };
    mockChurchProfileRepository.findByChurchIdIncludingDeleted.mockResolvedValue(activeProfile);

    await expect(usecase.execute(makeInput() as any)).rejects.toThrow(ConflictException);
    expect(mockChurchProfileRepository.create).not.toHaveBeenCalled();
  });
});
