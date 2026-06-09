import { GetAgendaUsecase } from './get-agenda.usecase';
import { AgendaFilter } from 'src/presentation/dtos/agenda/get-agenda-query.dto';

const mockAgendaRepository = {
  getAgenda: jest.fn(),
};

const makeAgenda = () => ({
  services: [],
  events: [],
  birthdays: [],
});

const mockCacheAdapter = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  deleteByPattern: jest.fn().mockResolvedValue(undefined),
};

describe('GetAgendaUsecase', () => {
  let usecase: GetAgendaUsecase;

  beforeEach(() => {
    jest.clearAllMocks();

    usecase = new GetAgendaUsecase(mockAgendaRepository, mockCacheAdapter);
    mockAgendaRepository.getAgenda.mockResolvedValue(makeAgenda());
  });

  describe('execute', () => {
    it('should call repository with correct date range for DAY filter', async () => {
      await usecase.execute('cid', AgendaFilter.DAY, '2026-06-05');

      expect(mockAgendaRepository.getAgenda).toHaveBeenCalledWith(
        'cid',
        new Date('2026-06-05T00:00:00.000Z'),
        new Date('2026-06-05T23:59:59.999Z'),
      );
    });

    it('should call repository with correct date range for WEEK filter', async () => {
      await usecase.execute('cid', AgendaFilter.WEEK, '2026-06-05');

      expect(mockAgendaRepository.getAgenda).toHaveBeenCalledWith(
        'cid',
        new Date('2026-06-05T00:00:00.000Z'),
        new Date('2026-06-11T23:59:59.999Z'),
      );
    });

    it('should call repository with correct date range for MONTH filter', async () => {
      await usecase.execute('cid', AgendaFilter.MONTH, '2026-06-05');

      expect(mockAgendaRepository.getAgenda).toHaveBeenCalledWith(
        'cid',
        new Date('2026-06-01T00:00:00.000Z'),
        new Date('2026-06-30T23:59:59.999Z'),
      );
    });

    it('should return the agenda from the repository', async () => {
      const agenda = makeAgenda();
      mockAgendaRepository.getAgenda.mockResolvedValue(agenda);

      const result = await usecase.execute(
        'cid',
        AgendaFilter.DAY,
        '2026-06-05',
      );

      expect(result).toBe(agenda);
      expect(mockAgendaRepository.getAgenda).toHaveBeenCalledWith(
        'cid',
        expect.any(Date),
        expect.any(Date),
      );
    });

    it('should return cached agenda without hitting the repository', async () => {
      const cached = makeAgenda();
      mockCacheAdapter.get.mockResolvedValueOnce(cached);

      const result = await usecase.execute('cid', AgendaFilter.DAY, '2026-06-05');

      expect(result).toBe(cached);
      expect(mockAgendaRepository.getAgenda).not.toHaveBeenCalled();
    });
  });
});
