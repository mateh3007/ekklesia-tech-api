import { CreateChurchEventUsecase } from './create-church-event.usecase';

const mockChurchEventRepository = {
  create: jest.fn(),
};

const makeInput = () => ({
  churchId: 'cid',
  title: 'Retiro Espiritual',
  description: 'Retiro anual da igreja',
  date: new Date('2026-07-15'),
});

const mockCacheAdapter = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  deleteByPattern: jest.fn().mockResolvedValue(undefined),
};

describe('CreateChurchEventUsecase', () => {
  let usecase: CreateChurchEventUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new CreateChurchEventUsecase(
      mockChurchEventRepository as any,
      mockCacheAdapter,
    );
  });

  it('should create a church event and return it', async () => {
    const input = makeInput();
    const created = {
      id: 'eid',
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockChurchEventRepository.create.mockResolvedValue(created);

    const result = await usecase.execute(input);

    expect(result).toBe(created);
    expect(mockChurchEventRepository.create).toHaveBeenCalledWith(input);
  });
});
