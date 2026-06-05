import { CreatePrayerRequestUsecase } from './create-prayer-request.usecase';

const mockPrayerRequestRepository = {
  create: jest.fn(),
};

const makeInput = () => ({
  churchId: 'cid',
  authorId: 'uid',
  name: 'João',
  request: 'Ore pela minha família',
});

describe('CreatePrayerRequestUsecase', () => {
  let usecase: CreatePrayerRequestUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new CreatePrayerRequestUsecase(
      mockPrayerRequestRepository as any,
    );
  });

  it('should create a prayer request and return it', async () => {
    const input = makeInput();
    const created = {
      id: 'prid',
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockPrayerRequestRepository.create.mockResolvedValue(created);

    const result = await usecase.execute(input);

    expect(result).toBe(created);
    expect(mockPrayerRequestRepository.create).toHaveBeenCalledWith(input);
  });
});
