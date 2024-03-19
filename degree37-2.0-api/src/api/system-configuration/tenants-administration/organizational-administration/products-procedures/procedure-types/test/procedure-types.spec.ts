import { Test, TestingModule } from '@nestjs/testing';
import { ProcedureTypesController } from '../controller/procedure-types.controller';
import { ProcedureTypesService } from '../services/procedure-types.service';

describe('ProcedureTypesService', () => {
  let procedureTypesController: ProcedureTypesController;
  let procedureTypesService: ProcedureTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProcedureTypesController],
      providers: [
        {
          provide: ProcedureTypesService,
          useValue: {
            create: jest.fn(),
            getAllProcedureTypes: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            archive: jest.fn(),
          },
        },
      ],
    }).compile();
    procedureTypesController = module.get<ProcedureTypesController>(
      ProcedureTypesController
    );
    procedureTypesService = module.get<ProcedureTypesService>(
      ProcedureTypesService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const procedureTypesData = {
      name: 'hello1',
      description: 'test1@gmail.com',
      short_description: 'test1@gmail.com',
      is_goal_type: false,
      procedure_duration: BigInt(10),
      is_active: false,
      is_generate_online_appointments: false,
      procedure_types_products: [
        {
          procedure_type_id: BigInt(2),
          product_id: BigInt(2),
          quantity: 10,
          forbidUnknownValues: true as const,
        },
      ],
      created_by: BigInt(1),
    };

    const createdProcedure = {
      status: 'success',
      response: 'Procedure Created Successfully',
      status_code: 201,
      data: {
        id: BigInt(1),
        name: 'string',
        short_description: 'string',
        description: 'string',
        is_goal_type: true,
        procedure_duration: 0,
        is_active: true,
        is_generate_online_appointments: true,
        created_by: 1,
        created_at: new Date(),
      },
    };

    it('should create a new procedure type', async () => {
      jest
        .spyOn(procedureTypesService, 'create')
        .mockResolvedValue(createdProcedure);

      const result = await procedureTypesController.create(procedureTypesData, {
        user: { tenant: { id: 1 } },
      } as any);
      expect(result).toEqual(createdProcedure);
      // expect(procedureTypesService.create).toHaveBeenCalledWith(
      //   procedureTypesData
      // );
    });
  });

  describe('listOfAllProcedureTypes', () => {
    const procedureTypeID = BigInt(123);
    const procedureTypeSearch = {
      page: 1,
      name: '',
      status: 'true',
      fetchAll: 'true',
      goal_type: 'true',
    };
    const products = {
      id: procedureTypeID,
      name: 'string',
      short_description: 'string',
      description: 'string',
      is_goal_type: true,
      beds_per_staff: '0',
      procedure_duration: '0',
      is_generate_online_appointments: true,
      is_active: true,
      created_at: '2023-07-25T11:02:15.384Z',
    };

    it('should get all procedure types', async () => {
      jest
        .spyOn(procedureTypesService, 'getAllProcedureTypes')
        .mockResolvedValue(products);
      const result = await procedureTypesController.findAll(
        procedureTypeSearch,
        {
          user: { tenant: { id: 1 } },
        } as any
      );
      expect(result).toEqual(products);
      // expect(procedureTypesService.getAllProcedureTypes).toHaveBeenCalledWith(
      //   procedureTypeSearch,
      //   {
      //     user: { tenant: { id: 1 } },
      //   }
      // );
    });
  });

  describe('GetSingleProcedureType', () => {
    const id = BigInt(1);
    const input = {
      id: id,
    };

    const procedureType = {
      id: id,
      name: 'test',
      short_description: 'abc',
      description: 'abc',
      is_goal_type: true,
      procedure_duration: BigInt(10),
      is_generate_online_appointments: true,
      is_active: true,
      created_at: new Date(),
      procedure_types_products: {
        id: id,
        procedure_type_id: BigInt(15),
        product_id: BigInt(2),
        quantity: BigInt(0),
        products: [
          {
            id: '2',
            name: 'bbcs',
            short_description: 'sndjsd',
            description: 'sdjjsdjb',
            is_active: true,
            external_reference: null,
            created_at: new Date(),
          },
        ],
      },
      procedure_products: [
        {
          id: id,
          procedures_id: id,
          product_id: id,
          quantity: id,
          products: [
            {
              id: '2',
              name: 'bbcs',
              short_description: 'sndjsd',
              description: 'sdjjsdjb',
              is_active: true,
              external_reference: null,
              created_at: new Date(),
            },
          ],
        },
      ],
    };

    it('should get a single procedure type', async () => {
      jest
        .spyOn(procedureTypesService, 'findOne')
        .mockResolvedValue(procedureType);

      const result = await procedureTypesController.findOne(input);
      expect(result).toEqual(procedureType);
      expect(procedureTypesService.findOne).toHaveBeenCalledWith(input);
    });
  });

  describe('update', () => {
    const procedureId = {
      id: BigInt(1),
    };
    const procedureTypeData = {
      name: 'string Updated',
      short_description: 'string Updated',
      description: 'string Updated',
      is_goal_type: true,
      procedure_duration: BigInt(50),
      is_active: true,
      is_generate_online_appointments: true,
      procedure_types_products: [],
      created_by: BigInt(1),
      updated_by: BigInt(1),
    };

    const updatedTenant = {
      status: 'Success',
      response: 'Changes Saved.',
      status_code: 204,
    };

    it('should update a procedure', async () => {
      jest
        .spyOn(procedureTypesService, 'update')
        .mockResolvedValue(updatedTenant);

      const result = await procedureTypesController.update(
        procedureId,
        procedureTypeData
      );
      expect(result).toEqual(updatedTenant);
      expect(procedureTypesService.update).toHaveBeenCalledWith(
        procedureId,
        procedureTypeData
      );
    });
  });

  describe('archive', () => {
    const procedureTypeId = {
      id: BigInt(1),
    };

    const updatedProcedureType = {
      status: 'Success',
      response: 'Changes Saved.',
      status_code: 204,
    };

    it('should update a procedure', async () => {
      jest
        .spyOn(procedureTypesService, 'archive')
        .mockResolvedValue(updatedProcedureType);

      const result = await procedureTypesController.archive(procedureTypeId);
      expect(result).toEqual(updatedProcedureType);
      expect(procedureTypesService.archive).toHaveBeenCalledWith(
        procedureTypeId
      );
    });
  });
});
