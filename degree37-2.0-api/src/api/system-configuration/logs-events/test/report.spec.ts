import { Test, TestingModule } from '@nestjs/testing';
import { ReportController } from '../controller/reports.controller';
import { ReportService } from '../services/report.service';
describe('ReportController', () => {
  let controller: ReportController;
  let service: ReportService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [
        {
          provide: ReportService,
          useValue: {
            generateReport: jest.fn(),
          },
        },
      ],
    }).compile();
    controller = module.get<ReportController>(ReportController);
    service = module.get<ReportService>(ReportService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('generateReport', () => {
    const search = {
      page: 1,
      limit: 10,
    };

    const records: any = {
      status: 'success',
      respons: 'Reports Fetched Succesfuly',
      code: 200,
      data: {
        total_records: 1,
        page_number: 1,
        data: [
          {
            created_at: '2023-07-24T08:43:03.607Z',
            activity: 'Login',
            browser: 'Chrome',
            date_time: '2023-07-24T08:43:03.607Z',
            email: 'johndoe@yahoo.com',
            location: '127.0.0.1',
            name: 'John Doe',
            page_name: 'login',
            status: 'Success',
          },
        ],
      },
    };

    it('should get all reports', async () => {
      jest.spyOn(service, 'generateReport').mockResolvedValue(records);
      const result = await controller.generateReport('LOGIN', search);
      expect(result).toEqual(records);
      expect(service.generateReport).toHaveBeenCalledWith('LOGIN', search);
    });
  });
});
