import { GetAllChurchEventsUsecase } from './get-all-church-events.usecase';

const mockChurchEventRepository = {
  findAll: jest.fn(),
};

describe('GetAllChurchEventsUsecase', () => {
  let usecase: GetAllChurchEventsUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new GetAllChurchEventsUsecase(mockChurchEventRepository as any);
  });

  it('should return all events for the church', async () => {
    const events = [{ id: 'e1' }, { id: 'e2' }];
    mockChurchEventRepository.findAll.mockResolvedValue(events);

    const result = await usecase.execute('cid');

    expect(result).toBe(events);
    expect(mockChurchEventRepository.findAll).toHaveBeenCalledWith('cid');
  });

  it('should return empty array when church has no events', async () => {
    mockChurchEventRepository.findAll.mockResolvedValue([]);

    const result = await usecase.execute('cid');

    expect(result).toEqual([]);
  });
});
