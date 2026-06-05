import { CreateChurchServiceRecordUsecase } from './create-church-service-record.usecase';

const mockChurchServiceRecordRepository = {
  create: jest.fn(),
};

const makeInput = () => ({
  churchId: 'cid',
  preacher: 'Pastor José',
  topic: 'Fé e Perseverança',
  bibleVerse: 'Hebreus 11:1',
  date: new Date('2026-06-08'),
});

describe('CreateChurchServiceRecordUsecase', () => {
  let usecase: CreateChurchServiceRecordUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new CreateChurchServiceRecordUsecase(mockChurchServiceRecordRepository as any);
  });

  it('should create a church service record and return it', async () => {
    const input = makeInput();
    const created = { id: 'rid', ...input, createdAt: new Date(), updatedAt: new Date() };
    mockChurchServiceRecordRepository.create.mockResolvedValue(created);

    const result = await usecase.execute(input);

    expect(result).toBe(created);
    expect(mockChurchServiceRecordRepository.create).toHaveBeenCalledWith(input);
  });
});
