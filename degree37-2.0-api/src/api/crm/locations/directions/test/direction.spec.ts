import { Test, TestingModule } from '@nestjs/testing';
import { DirectionsController } from '../controller/direction.controller';
import { DirectionsService } from '../services/direction.service';
import { CreateDirectionsDto } from '../dto/create-direction.dto';

describe('DirectionsService', () => {
  let directionController: DirectionsController;
  let directionService: DirectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DirectionsController],
      providers: [
        {
          provide: DirectionsService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn(),
            updateDirectionConfig: jest.fn(),
            getDirectionConfig: jest.fn(),
          },
        },
      ],
    }).compile();

    directionController =
      module.get<DirectionsController>(DirectionsController);
    directionService = module.get<DirectionsService>(DirectionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const directionData: any = {
      direction: 'hello1',
      miles: 55,
      minutes: 123,
      is_archived: false,
      //   created_by: 5,
      //   tenant_id: 1,
      forbidUnknownValues: true as const, // Update the type explicitly
      location_id: '2',
      collection_operation_id: 1,
    };

    const createdDirection: any = {
      status: 'success',
      message: 'Direction Created',
      status_code: 201,
      data: {
        id: BigInt(1),
        direction: 'hello1',
        miles: 55,
        minutes: 123,
        is_archived: false,
        created_at: new Date(),
        created_by: 5,
        location_id: '2',
        collection_operation_id: [{ id: 1, name: 'hn' }],
      },
    };

    it('should create a new direction', async () => {
      jest
        .spyOn(directionService, 'create')
        .mockResolvedValue(createdDirection);
      const req: any = {
        user: {
          id: 5,
          tenant: {
            id: 1,
          },
        },
      };
      const result = await directionController.create(directionData, req);
      expect(result).toEqual(createdDirection);
      expect(directionService.create).toHaveBeenCalledWith(directionData, req);
    });
  });

  describe('update', () => {
    const directionId = {
      id: BigInt(1),
    };
    const directionData: any = {
      direction: 'hello1',
      miles: 55,
      minutes: 123,
      is_archived: false,

      created_by: 5,
      tenant_id: 5,

      forbidUnknownValues: true as const, // Update the type explicitly
      location_id: '2',
      collection_operation_id: 1,
    };

    const updatedDirection: any = {
      status: 'success',
      message: '',
      status_code: 201,
      data: {
        id: BigInt(1),
        direction: 'hey',
        miles: 99,
        minutes: 8,
        is_archived: false,
        created_at: new Date(),
        created_by: 5,
        location_id: '2',
        collection_operation_id: [{ id: 3, name: 'ddf' }],
      },
    };

    it('should update a tenant', async () => {
      jest
        .spyOn(directionService, 'update')
        .mockResolvedValue(updatedDirection);
      const req: any = {
        user: {
          id: 5,
          tenant: {
            id: 5,
          },
        },
      };
      const result = await directionController.update(
        directionId,
        directionData,
        req
      );
      expect(result).toEqual(updatedDirection);
      expect(directionService.update).toHaveBeenCalledWith(
        directionId,
        directionData,
        req
      );
    });
  });

  describe('listOfAllDirections', () => {
    const LocationId = BigInt(123);
    const directionSearch: any = {
      page: 1,
    };
    const directions: any = {
      id: LocationId,
      direction: 'hello1',
      miles: 55,
      minutes: 123,
      is_archived: false,

      created_by: 5,
      tenant_id: 5,

      forbidUnknownValues: true as const, // Update the type explicitly
      location_id: '2',
      collection_operation_id: 1,
      created_at: new Date(),
    };

    it('should get all direction', async () => {
      jest.spyOn(directionService, 'findAll').mockResolvedValue(directions);
      const result = await directionController.findAll(directionSearch);
      expect(result).toEqual(directions);
      expect(directionService.findAll).toHaveBeenCalledWith(directionSearch);
    });
  });
});
