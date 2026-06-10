import { GetLatestChurchServiceRecordUsecase } from './get-latest-church-service-record.usecase';

const mockChurchServiceRecordRepository = {
  findLatestByChurchId: jest.fn(),
};

describe('GetLatestChurchServiceRecordUsecase', () => {
  let usecase: GetLatestChurchServiceRecordUsecase;

  beforeEach(() => {
    jest.clearAllMocks();
    usecase = new GetLatestChurchServiceRecordUsecase(
      mockChurchServiceRecordRepository as any,
    );
  });

  it('should return the latest record when it exists', async () => {
    const record = {
      id: 'rid',
      churchId: 'cid',
      preacher: 'Pastor',
      date: new Date(),
    };
    mockChurchServiceRecordRepository.findLatestByChurchId.mockResolvedValue(
      record,
    );

    const result = await usecase.execute('cid');

    expect(result).toBe(record);
    expect(
      mockChurchServiceRecordRepository.findLatestByChurchId,
    ).toHaveBeenCalledWith('cid');
  });

  it('should return null when church has no records', async () => {
    mockChurchServiceRecordRepository.findLatestByChurchId.mockResolvedValue(
      null,
    );

    const result = await usecase.execute('cid');

    expect(result).toBeNull();
  });
});
