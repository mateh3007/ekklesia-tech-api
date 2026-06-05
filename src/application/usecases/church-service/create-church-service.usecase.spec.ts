import { CreateChurchServiceUsecase } from './create-church-service.usecase';
import { Day } from 'src/domain/enums/day.enu';

const mockChurchServiceRepository = {
  create: jest.fn(),
};

const makeInput = () => ({
  churchId: 'cid',
  title: 'Culto de Domingo',
  description: 'Culto principal da semana',
  day: Day.SUNDAY,
  startsAt: '09:00',
  endsAt: '11:00',
  isOnline: false,
});

describe('CreateChurchServiceUsecase', () => {
  let usecase: CreateChurchServiceUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new CreateChurchServiceUsecase(mockChurchServiceRepository as any);
  });

  it('should create a church service and return it', async () => {
    const input = makeInput();
    const created = { id: 'sid', ...input, createdAt: new Date(), updatedAt: new Date() };
    mockChurchServiceRepository.create.mockResolvedValue(created);

    const result = await usecase.execute(input);

    expect(result).toBe(created);
    expect(mockChurchServiceRepository.create).toHaveBeenCalledWith(input);
  });
});
