import { Test, TestingModule } from '@nestjs/testing';
import { StaffingController } from '../controller/staffing.controller';
import { StaffingService } from '../service/staffing.service';
import { GetAllStaffingFilterInterface } from '../interface/get-staffing-filter.interface';
import { ShiftableTypeEnum } from '../../../staffing_enum/staffing_enum';

describe('Staffing Controller', () => {
  let controller: StaffingController;
  let service: StaffingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffingController],
      providers: [
        {
          provide: StaffingService,
          useValue: {
            getStaffScheduleDetails: jest.fn(), // Mock the method
          },
        },
      ],
    }).compile();

    controller = module.get<StaffingController>(StaffingController);
    service = module.get<StaffingService>(StaffingService);
  });

  describe('Get Staff Schedule Details', () => {
    it('should call getStaffScheduleDetails with the correct parameters', async () => {
      const id = BigInt(1);

      const getStaffingFilterInterface: GetAllStaffingFilterInterface = {
        fetch_all: false,
        keyword: '',
        shiftable_type: ShiftableTypeEnum.OC_OPERATIONS_DRIVES,
      };
      await controller.getAllByDrives(getStaffingFilterInterface, id);

      expect(service.getStaffScheduleDetails).toHaveBeenCalledWith(
        id,
        getStaffingFilterInterface
      );
    });

    it('should return the result from getStaffScheduleDetails', async () => {
      const id = BigInt(1);
      const getStaffingFilterInterface = {
        shiftable_type: ShiftableTypeEnum.OC_OPERATIONS_DRIVES,
        fetch_all: false,
        keyword: '',
      };

      const expectedResult = {
        status: 'success',
        response: '',
        code: 200,
        record_count: 1,
        data: [
          {
            id: 1,
            begin_day: '2023-11-04T19:00:00.000Z',
            end_day: '2023-11-04T19:00:00.000Z',
            draw_hours: '12:46 AM - 12:46 AM',
            role: 'Test 12',
            staff_name: 'External Account Test D',
            total_hours: 20,
            is_archived: false,
          },
        ],
      };

      jest
        .spyOn(service, 'getStaffScheduleDetails')
        .mockResolvedValue(expectedResult);

      const result = await controller.getAllByDrives(
        getStaffingFilterInterface,
        id
      );

      expect(result).toEqual(expectedResult);
    });
  });
});
