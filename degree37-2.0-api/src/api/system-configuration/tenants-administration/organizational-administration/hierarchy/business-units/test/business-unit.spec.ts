import { Test, TestingModule } from '@nestjs/testing';
import { BusinessUnitsController } from '../controller/business-units.controller';
import { BusinessUnitsService } from '../services/business-units.service';

describe('BusinessUnitService', () => {
  let businessUnitController: BusinessUnitsController;
  let businessUnitService: BusinessUnitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessUnitsController],
      providers: [
        {
          provide: BusinessUnitsService,
          useValue: {
            listAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();
    businessUnitController = module.get<BusinessUnitsController>(
      BusinessUnitsController
    );
    businessUnitService =
      module.get<BusinessUnitsService>(BusinessUnitsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listOfAllBusinessUnits', () => {
    const businessUnits = {
      status: 'success',
      response: 'Business Unit fetched Successfully',
      status_code: 201,
      data: [
        {
          id: '1',
          name: 'string',
          is_active: true,
          created_at: '2023-08-02T13:20:24.149Z',
        },
        {
          id: '2',
          name: 'ubuhuhyjvn',
          is_active: true,
          created_at: '2023-08-02T13:24:41.785Z',
        },
      ],
    };

    it('should get all Business Units', async () => {
      jest
        .spyOn(businessUnitService, 'listAll')
        .mockResolvedValue(businessUnits);
      const result = await businessUnitController.listAll({
        user: { tenant: { id: 1 } },
      } as any);
      expect(result).toEqual(businessUnits);
    });
  });

  describe('create', () => {
    const businessUnitData = {
      name: 'string',
      organizational_level_id: BigInt(1),
      parent_level_id: null,
      is_active: true,
      created_by: BigInt(1),
      updated_by: BigInt(1),
      tenant_id: 1,
    };

    const createdBusinessUnit = {
      status: 'success',
      response: 'Business Unit Created Successfully',
      status_code: 201,
      data: {
        name: 'string',
        is_active: true,
        created_by: 1,
        parent_level: null,
        organizational_level_id: {
          id: '1',
          name: 'string',
          short_label: 'string',
          description: 'string',
          is_active: true,
          created_at: '2023-08-02T13:20:01.625Z',
        },
        id: '3',
        created_at: '2023-08-02T15:03:16.652Z',
      },
    };

    it('should create a new Business Unit', async () => {
      jest
        .spyOn(businessUnitService, 'create')
        .mockResolvedValue(createdBusinessUnit);

      const result = await businessUnitController.create(businessUnitData, {
        user: { tenant: { id: 1 } },
      } as any);
      expect(result).toEqual(createdBusinessUnit);
      expect(businessUnitService.create).toHaveBeenCalledWith(businessUnitData);
    });
  });
});
