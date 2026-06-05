import { GetAllChurchServiceRecordsUsecase } from './get-all-church-service-records.usecase';

const mockChurchServiceRecordRepository = {
  findAllByChurchId: jest.fn(),
};

describe('GetAllChurchServiceRecordsUsecase', () => {
  let usecase: GetAllChurchServiceRecordsUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new GetAllChurchServiceRecordsUsecase(mockChurchServiceRecordRepository as any);
  });

  it('should return all records for the church', async () => {
    const records = [{ id: 'r1' }, { id: 'r2' }];
    mockChurchServiceRecordRepository.findAllByChurchId.mockResolvedValue(records);

    const result = await usecase.execute('cid');

    expect(result).toBe(records);
    expect(mockChurchServiceRecordRepository.findAllByChurchId).toHaveBeenCalledWith('cid');
  });

  it('should return empty array when church has no records', async () => {
    mockChurchServiceRecordRepository.findAllByChurchId.mockResolvedValue([]);

    const result = await usecase.execute('cid');

    expect(result).toEqual([]);
  });
});
