import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationalLevelController } from '../controller/organizational-level.controller';
import { OrganizationalLevelService } from '../services/organizational-level.service';
import { AuthMiddleware } from '../../../../../../middlewares/auth';
import { UserRequest } from 'src/common/interface/request';

describe('OrganizationalLevelService', () => {
  let organizationalLevelController: OrganizationalLevelController;
  let organizationalLevelService: OrganizationalLevelService;
  const mockAuthMiddleware = {
    use: jest.fn((req, res, next) => next()),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationalLevelController],
      providers: [
        {
          provide: OrganizationalLevelService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findOne: jest.fn(),
            archive: jest.fn(),
          },
        },
        {
          provide: AuthMiddleware,
          useValue: mockAuthMiddleware,
        },
      ],
    }).compile();
    organizationalLevelController = module.get<OrganizationalLevelController>(
      OrganizationalLevelController
    );
    organizationalLevelService = module.get<OrganizationalLevelService>(
      OrganizationalLevelService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listOfAllOrganizationalLevels', () => {
    const search = {
      page: 1,
      limit: 10,
      tenant_id: 2,
      collectionOperation: 'false',
    };

    const organizationalLevels: any = {
      status: 'success',
      respons: 'Organizational Levels Fetched Succesfuly',
      code: 200,
      data: {
        total_records: 1,
        page_number: 1,
        data: [
          {
            id: '15',
            name: 'string',
            parent_level: null,
            created_at: '2023-07-24T08:43:03.607Z',
            short_label: 'string',
            description: 'string',
          },
        ],
      },
    };

    it('should get all organizational levels', async () => {
      jest
        .spyOn(organizationalLevelService, 'findAll')
        .mockResolvedValue(organizationalLevels);
      const result = await organizationalLevelController.findAll(
        {
          user: { tenant: { id: 1 } },
        } as any,
        search
      );
      expect(result).toEqual(organizationalLevels);
      expect(organizationalLevelService.findAll).toHaveBeenCalledWith(search);
    });
  });
  describe('create', () => {
    const OrganizationalLevelsData = {
      name: 'string',
      short_label: 'string',
      description: 'string',
      parent_level_id: null,
      is_active: true,
      created_by: BigInt(1),
      tenant_id: BigInt(1),
      updated_by: BigInt(1),
    };

    const createdOrganizationalLevels = {
      status: 'success',
      response: 'Organizational Level Created Successfully',
      status_code: 201,
      data: {
        id: 1,
        name: 'string',
        short_label: 'string',
        description: 'string',
        is_active: true,
        created_by: 1,
        created_at: '2023-07-26T08:47:12.638Z',
      },
    };

    it('should create a new organizational level', async () => {
      jest
        .spyOn(organizationalLevelService, 'create')
        .mockResolvedValue(createdOrganizationalLevels);

      const result = await organizationalLevelController.create(
        OrganizationalLevelsData,
        {
          user: { tenant: { id: 1 } },
        } as any
      );
      expect(result).toEqual(createdOrganizationalLevels);
      expect(organizationalLevelService.create).toHaveBeenCalledWith(
        OrganizationalLevelsData
      );
    });
  });

  describe('update', () => {
    const organizationalLevelId = '1';
    const OrganizationalLevelsData = {
      name: 'string',
      short_label: 'string',
      description: 'string',
      parent_level_id: null,
      is_active: true,
      created_by: BigInt(1),
      updated_by: BigInt(1),
      tenant_id: BigInt(1),
    };

    const updatedOrganizationalLevels = {
      status: 'success',
      response: 'Organizational Level Updated Successfully',
      status_code: 200,
      data: {
        id: BigInt(1),
        name: 'string',
        short_label: 'string',
        description: 'string',
        is_active: true,
        created_by: 1,
        created_at: '2023-07-26T08:47:12.638Z',
      },
    };

    it('should update the organizational level', async () => {
      jest
        .spyOn(organizationalLevelService, 'update')
        .mockResolvedValue(updatedOrganizationalLevels);

      const req: any = {
        user: {
          id: BigInt(1),
        },
      };

      const result = await organizationalLevelController.update(
        organizationalLevelId,
        OrganizationalLevelsData,
        req
      );
      expect(result).toEqual(updatedOrganizationalLevels);
      expect(organizationalLevelService.update).toHaveBeenCalledWith(
        +organizationalLevelId,
        OrganizationalLevelsData
      );
    });
  });

  describe('findOne', () => {
    const organizationalLevelId = '1';

    const viewedOrganizationalLevels = {
      status: 'success',
      response: 'Organizational Level Found Successfully',
      status_code: 302,
      data: {
        id: BigInt(1),
        name: 'string',
        short_label: 'string',
        description: 'string',
        is_active: true,
        created_by: 1,
        created_at: '2023-07-26T08:47:12.638Z',
        parent_level: null,
      },
    };

    it('should find the organizational level', async () => {
      jest
        .spyOn(organizationalLevelService, 'findOne')
        .mockResolvedValue(viewedOrganizationalLevels);

      const result = await organizationalLevelController.findOne(
        organizationalLevelId
      );
      expect(result).toEqual(viewedOrganizationalLevels);
      expect(organizationalLevelService.findOne).toHaveBeenCalledWith(
        +organizationalLevelId
      );
    });
  });

  describe('archive', () => {
    const organizationalLevelId = '1';

    const archivedOrganizationalLevels = {
      status: 'success',
      response: 'Organizational Level Archieved Successfully',
      status_code: 200,
      data: {
        id: BigInt(1),
        name: 'string',
        short_label: 'string',
        description: 'string',
        is_active: true,
        is_archive: true,
        created_by: 1,
        created_at: '2023-07-26T08:47:12.638Z',
        parent_level: null,
      },
    };

    it('should archive the organizational level', async () => {
      jest
        .spyOn(organizationalLevelService, 'archive')
        .mockResolvedValue(archivedOrganizationalLevels);

      const req: any = {
        user: {
          id: BigInt(1),
        },
      };

      const result = await organizationalLevelController.archive(
        organizationalLevelId,
        req
      );
      expect(result).toEqual(archivedOrganizationalLevels);
      expect(organizationalLevelService.archive).toHaveBeenCalledWith(
        +organizationalLevelId,
        BigInt(1)
      );
    });
  });
});
