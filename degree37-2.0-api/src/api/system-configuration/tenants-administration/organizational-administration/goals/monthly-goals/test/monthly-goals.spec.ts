import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderByConstants } from '../../../../../constants/order-by.constants';
import { MonthlyGoalsController } from '../controller/monthly-goals.controller';
import { MonthlyGoalsService } from '../services/monthly-goals.service';
import { Tenant } from '../../../../../platform-administration/tenant-onboarding/tenant/entities/tenant.entity';
import { User } from '../../../../../tenants-administration/user-administration/user/entity/user.entity';
import { ProcedureTypes } from '../../../products-procedures/procedure-types/entities/procedure-types.entity';
import { BusinessUnits } from '../../../hierarchy/business-units/entities/business-units.entity';
import { Donor } from '../../../../../../donor-portal/donor/entities/donor.entity';

describe('MonthlyGoalsService', () => {
  let monthlyGoalsController: MonthlyGoalsController;
  let monthlyGoalsService: MonthlyGoalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonthlyGoalsController],
      providers: [
        {
          provide: MonthlyGoalsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            archive: jest.fn(),
          },
        },
      ],
    }).compile();
    monthlyGoalsController = module.get<MonthlyGoalsController>(
      MonthlyGoalsController
    );
    monthlyGoalsService = module.get<MonthlyGoalsService>(MonthlyGoalsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const reqData = {
      procedure_type: BigInt(1),
      collection_operation: [1],
      donor_center: BigInt(1),
      year: 1,
      january: 1,
      february: 1,
      march: 1,
      april: 1,
      may: 1,
      june: 1,
      july: 1,
      august: 1,
      september: 1,
      october: 1,
      november: 1,
      december: 1,
      total_goal: 20,
      created_by: BigInt(2),
      tenant_id: BigInt(2),
      updated_by: BigInt(2),
      recruiter: BigInt(2),
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: new Date(),
      is_deleted: false,
      is_archived: false,
    };
    const responseData = {
      status: HttpStatus.CREATED,
      message: 'Monthly Goals Created Successfully',
      data: {
        id: BigInt(1),
        procedure_type: { id: BigInt(1) } as ProcedureTypes,
        collection_operation: [{ id: BigInt(1) }] as BusinessUnits[],
        donor_center: { id: BigInt(1) } as Donor,
        year: 1,
        january: 1,
        february: 1,
        march: 1,
        april: 1,
        may: 1,
        june: 1,
        total_goal: 20,
        july: 1,
        august: 1,
        september: 1,
        october: 1,
        november: 1,
        december: 1,
        created_by: { id: BigInt(2) } as User,
        tenant_id: { id: BigInt(2) } as Tenant,
        recruiter: { id: BigInt(2) } as User,
        updated_by: BigInt(2),
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: new Date(),
        is_deleted: false,
        is_archived: false,
      },
    };

    it('should create a new Monthly Goals', async () => {
      jest.spyOn(monthlyGoalsService, 'create').mockResolvedValue(responseData);
      const result = await monthlyGoalsController.create(reqData, {
        user: { id: 1, tenant: { id: 1 } },
      } as any);
      expect(result).toEqual(responseData);
      expect(monthlyGoalsService.create).toHaveBeenCalledWith(reqData);
    });
  });

  describe('update', () => {
    const id = BigInt(1);
    const reqData = {
      procedure_type: BigInt(1),
      collection_operation: [1],
      donor_center: BigInt(1),
      year: 1,
      january: 1,
      february: 1,
      march: 1,
      april: 1,
      may: 1,
      june: 1,
      july: 1,
      august: 1,
      september: 1,
      october: 1,
      november: 1,
      december: 1,
      created_by: BigInt(2),
      updated_by: BigInt(2),
      recruiter: BigInt(2),
      tenant_id: BigInt(2),
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: new Date(),
      is_deleted: false,
      is_archived: false,
    };
    const responseData = {
      status: HttpStatus.CREATED,
      message: 'Monthly Goals Created Successfully',
      data: {
        id: BigInt(1),
        procedure_type: { id: BigInt(1) } as ProcedureTypes,
        collection_operation: [
          {
            id: BigInt(1),
            name: 'Business unit',
            tenant_id: { id: BigInt(2) } as Tenant,
            is_active: true,
            created_at: new Date(),
            is_archived: false,
            created_by: { id: BigInt(2) } as User,
          },
        ] as BusinessUnits[],
        donor_center: { id: BigInt(1) } as Donor,
        year: 1,
        january: 1,
        february: 1,
        march: 1,
        april: 1,
        may: 1,
        june: 1,
        july: 1,
        august: 1,
        september: 1,
        october: 1,
        november: 1,
        december: 1,
        created_by: { id: BigInt(2) } as User,
        tenant_id: { id: BigInt(2) } as Tenant,
        recruiter: { id: BigInt(2) } as User,
        updated_by: BigInt(2),
        total_goal: 20,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: new Date(),
        is_deleted: false,
        is_archived: false,
      },
    };

    it('should update Monthly Goals', async () => {
      jest.spyOn(monthlyGoalsService, 'update').mockResolvedValue(responseData);

      const result = await monthlyGoalsController.update(id, reqData, {
        user: { id: 1, tenant: { id: 1 } },
      } as any);
      expect(result).toEqual(responseData);
      expect(monthlyGoalsService.update).toHaveBeenCalledWith(id, reqData);
    });
  });

  describe('findAll', () => {
    const search = {
      page: 1,
      limit: parseInt(process.env.PAGE_SIZE),
      sortBy: 'id',
      year: 0,
      sortOrder: OrderByConstants.DESC,
      procedure_type: BigInt(1),
      collection_operation: BigInt(1),
      donor_center: BigInt(1),
    };
    const monthlyGoals = {
      status: HttpStatus.OK,
      message: 'Monthly Goals Fetched Successfully',
      data: [
        {
          id: BigInt(11),
          year: 2023,
          january: 20,
          february: 20,
          march: 20,
          april: 20,
          may: 20,
          june: 20,
          july: 20,
          august: 20,
          september: 20,
          october: 20,
          november: 20,
          december: 20,
          total_goal: 20,
          created_at: new Date(),
          updated_at: new Date(),
          is_deleted: false,
          deleted_at: new Date(),
          is_archived: false,
          created_by: { id: BigInt(2) } as User,
          recruiter: { id: BigInt(2) } as User,
          tenant_id: { id: BigInt(2) } as Tenant,
          updated_by: BigInt(2),
          procedure_type: { id: BigInt(2) } as ProcedureTypes,
          collection_operation: [{ id: BigInt(2) }] as BusinessUnits[],
          donor_center: { id: BigInt(2) } as Donor,
        },
      ],
      count: 1,
    };

    it('should get all monthly goals', async () => {
      jest
        .spyOn(monthlyGoalsService, 'findAll')
        .mockResolvedValue(monthlyGoals);
      const result = await monthlyGoalsController.findAll(search, {
        user: { id: 1, tenant: { id: 1 } },
      } as any);
      expect(result).toEqual(monthlyGoals);
      expect(monthlyGoalsService.findAll).toHaveBeenCalledWith(search);
    });
  });

  describe('findOne', () => {
    const search = {
      id: BigInt(1),
    };
    const monthlyGoals = {
      status: HttpStatus.OK,
      message: 'Monthly Goals Fetched Successfully',
      data: {
        id: BigInt(11),
        year: 2023,
        january: 20,
        february: 20,
        march: 20,
        april: 20,
        may: 20,
        june: 20,
        july: 20,
        august: 20,
        september: 20,
        october: 20,
        november: 20,
        total_goal: 20,
        december: 20,
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: false,
        deleted_at: new Date(),
        is_archived: false,
        created_by: { id: BigInt(2) } as User,
        recruiter: { id: BigInt(2) } as User,
        updated_by: BigInt(2),
        procedure_type: { id: BigInt(2) } as ProcedureTypes,
        tenant_id: { id: BigInt(2) } as Tenant,
        collection_operation: { id: BigInt(2) } as BusinessUnits,
        donor_center: { id: BigInt(2) } as Donor,
      },
    };

    it('should get a single monthly goals', async () => {
      jest
        .spyOn(monthlyGoalsService, 'findOne')
        .mockResolvedValue(monthlyGoals);
      const result = await monthlyGoalsController.find(search);
      expect(result).toEqual(monthlyGoals);
      expect(monthlyGoalsService.findOne).toHaveBeenCalledWith(search);
    });
  });
});
