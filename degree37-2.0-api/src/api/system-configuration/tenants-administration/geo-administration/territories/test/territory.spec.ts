import { Test, TestingModule } from '@nestjs/testing';
import { TerritoryController } from '../controller/territories.controller';
import { TerritoryService } from '../services/territories.service';
import { CreateTerritoriyDto } from '../dto/territory.dto';
import { Territory } from '../entities/territories.entity';

describe('TerritoryService', () => {
  let territoryController: TerritoryController;
  let territoryService: TerritoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TerritoryController],
      providers: [
        {
          provide: TerritoryService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();
    territoryController = module.get<TerritoryController>(TerritoryController);
    territoryService = module.get<TerritoryService>(TerritoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const territoryData: CreateTerritoriyDto = {
      territory_name: 'Test 101',
      description: 'Lorem Inpsum Lorem Ipsum',
      recruiter: BigInt(1),
      created_by: BigInt(2),
      status: true,
    };

    const createdTerritory = {
      status: 'success',
      response: 'Territory Created',
      status_code: 201,
      data: {
        id: BigInt(13),
        ...territoryData,
        is_archive: false,
        created_at: new Date(),
        // updated_at: new Date(),
      },
    };

    it('should create a new territory', async () => {
      jest
        .spyOn(territoryService, 'create')
        .mockResolvedValue(createdTerritory);

      const result = await territoryController.create(territoryData, {
        user: { id: 1, tenant: { id: 1 } },
      } as any);
      expect(result).toEqual(createdTerritory);
      expect(territoryService.create).toHaveBeenCalledWith(territoryData);
    });
  });
});
