import { CreateAnnouncementUsecase } from './create-announcement.usecase';

const mockAnnouncementRepository = {
  create: jest.fn(),
};

const makeInput = () => ({
  churchId: 'cid',
  authorId: 'uid',
  title: 'Aviso Importante',
  content: 'Conteúdo do aviso',
  date: new Date('2026-06-10'),
});

const mockCacheAdapter = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  deleteByPattern: jest.fn().mockResolvedValue(undefined),
};

describe('CreateAnnouncementUsecase', () => {
  let usecase: CreateAnnouncementUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new CreateAnnouncementUsecase(
      mockAnnouncementRepository as any,
      mockCacheAdapter,
    );
  });

  it('should create an announcement and return it', async () => {
    const input = makeInput();
    const created = {
      id: 'aid',
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockAnnouncementRepository.create.mockResolvedValue(created);

    const result = await usecase.execute(input);

    expect(result).toBe(created);
    expect(mockAnnouncementRepository.create).toHaveBeenCalledWith(input);
  });
});
