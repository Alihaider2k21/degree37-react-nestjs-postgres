import { Test, TestingModule } from '@nestjs/testing';
import { TenantController } from '../controller/tenant.controller';
import { TenantService } from '../services/tenant.service';
import { CreateTenantDto } from '../dto/create-tenant.dto';

describe('TenantService', () => {
  let tenantController: TenantController;
  let tenantService: TenantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantController],
      providers: [
        {
          provide: TenantService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn(),
            updateTenantConfig: jest.fn(),
            getTenantConfig: jest.fn(),
          },
        },
      ],
    }).compile();
    tenantController = module.get<TenantController>(TenantController);
    tenantService = module.get<TenantService>(TenantService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const tenantData: any = {
      tenant_name: 'hello1',
      tenant_domain: 'https://pk.godaddy.com',
      admin_domain: 'https://pk.godaddy.com/',
      email: 'test1@gmail.com',
      tenant_code: 'ASV',
      tenant_timezone: 'AST',
      phone_number: '(123) 456-7890',
      address1: 'string',
      address2: 'string',
      zip_code: '12345',
      city: 'string',
      state: 'string',
      country: 'Australia',
      password: 'Qwee233*',
      created_by: BigInt(1),
      allow_email: false,
      is_active: false,
      county: 'ASDFGH',
      coordinates: { latitude: '12.147', longitude: '-90.147' },
      forbidUnknownValues: true as const, // Update the type explicitly
      tenant_config: [
        {
          element_name: 'string',
          end_point_url: 'https://pk.godaddy.com/',
          secret_key: 'string',
          secret_value: 'string',
          created_by: BigInt(1),
        },
      ],
      applications: [
        {
          id: 1,
          name: 'System Configuration',
          created_at: '2023-08-08T12:28:34.007Z',
        },
        {
          id: 2,
          name: 'CRM',
          created_at: '2023-08-08T12:28:34.249Z',
        },
      ],
    };

    const createdTenant = {
      status: 'success',
      message: '',
      status_code: 201,
      data: {
        id: BigInt(1),
        tenant_name: 'hello4',
        tenant_domain: 'https://pk.godaddy.com',
        admin_domain: 'https://pk.godaddy.com/',
        email: 'test4@gmail.com',
        tenant_code: 'ASL',
        phone_number: '(123) 456-7890',
        is_active: false,
        password:
          '$2b$10$FR0wUqSX7WSIhAAsLB0mNOEw4hlcQ6uhQL87HAu5Cu47Sh/WCPK.S',
        tenant_timezone: 'AST',
        allow_email: true,
        created_at: new Date(),
        created_by: BigInt(1),
        addresses: [
          {
            id: BigInt(1),
            addressable_type: null,
            addressable_id: BigInt(1),
            address1: 'string',
            address2: 'string',
            zip_code: '12345',
            city: 'string',
            state: 'string',
            country: 'Australia',
            county: null,
            coordinates: { latitude: '12.147', longitude: '-90.147' },
            created_at: new Date(),
            created_by: BigInt(1),
          },
        ],
        configurations: [
          {
            id: 1,
            element_name: 'string',
            end_point_url: 'https://pk.godaddy.com/',
            secret_key: 'U2FsdGVkX1/StaIsKbrTHBVdhnQjwcivVE/oS+Sjr1o=',
            secret_value: 'U2FsdGVkX1+zBJC1Y1rNmikPONJbYhioEHHOW/DAjIU=',
            created_at: new Date(),
            created_by: BigInt(1),
            tenant_id: BigInt(1),
          },
        ],
        applications: [
          {
            id: 1,
            name: 'System Configuration',
            created_at: '2023-08-08T12:28:34.007Z',
          },
          {
            id: 2,
            name: 'CRM',
            created_at: '2023-08-08T12:28:34.249Z',
          },
        ],
      },
    };

    it('should create a new tenant', async () => {
      jest.spyOn(tenantService, 'create').mockResolvedValue(createdTenant);

      const result = await tenantController.create(tenantData);
      expect(result).toEqual(createdTenant);
      expect(tenantService.create).toHaveBeenCalledWith(tenantData);
    });
  });

  describe('update', () => {
    const tenantId = {
      id: BigInt(1),
    };
    const tenantData: any = {
      tenant_name: 'hello1',
      tenant_domain: 'https://pk.godaddy.com',
      admin_domain: 'https://pk.godaddy.com/',
      email: 'test1@gmail.com',
      tenant_code: 'ASV',
      tenant_timezone: 'AST',
      phone_number: '(123) 456-7890',
      address1: 'string',
      address2: 'string',
      zip_code: '12345',
      city: 'string',
      state: 'string',
      country: 'Australia',
      password: 'Qwee233*',
      created_by: BigInt(1),
      allow_email: false,
      is_active: false,
      county: 'ASDFGH',
      coordinates: { latitude: '12.147', longitude: '-90.147' },
      address_id: BigInt(1),
      forbidUnknownValues: true as const, // Update the type explicitly
      tenant_config: [
        {
          id: BigInt(31),
          element_name: 'string',
          end_point_url: 'https://pk.godaddy.com/',
          secret_key: 'string',
          secret_value: 'string',
          created_by: BigInt(1),
        },
      ],
      applications: [
        {
          id: 1,
          name: 'System Configuration',
          created_at: '2023-08-08T12:28:34.007Z',
        },
        {
          id: 2,
          name: 'CRM',
          created_at: '2023-08-08T12:28:34.249Z',
        },
      ],
    };

    const updatedTenant: any = {
      status: 'success',
      message: '',
      status_code: 201,
      data: {
        id: BigInt(1),
        tenant_name: 'hello4',
        tenant_domain: 'https://pk.godaddy.com',
        admin_domain: 'https://pk.godaddy.com/',
        email: 'test4@gmail.com',
        tenant_code: 'ASL',
        phone_number: '(123) 456-7890',
        is_active: false,
        password:
          '$2b$10$FR0wUqSX7WSIhAAsLB0mNOEw4hlcQ6uhQL87HAu5Cu47Sh/WCPK.S',
        tenant_timezone: 'AST',
        allow_email: true,
        created_at: new Date(),
        created_by: BigInt(1),
        addresses: [
          {
            id: BigInt(1),
            addressable_type: null,
            addressable_id: BigInt(1),
            address1: 'string',
            address2: 'string',
            zip_code: '12345',
            city: 'string',
            state: 'string',
            country: 'Australia',
            county: null,
            coordinates: null,
            created_at: new Date(),
            created_by: BigInt(1),
          },
        ],
        configurations: [
          {
            id: 31,
            element_name: 'string',
            end_point_url: 'https://pk.godaddy.com/',
            secret_key: 'U2FsdGVkX1/StaIsKbrTHBVdhnQjwcivVE/oS+Sjr1o=',
            secret_value: 'U2FsdGVkX1+zBJC1Y1rNmikPONJbYhioEHHOW/DAjIU=',
            created_at: new Date(),
            created_by: BigInt(1),
            tenant_id: BigInt(1),
          },
        ],
        applications: [
          {
            id: 1,
            name: 'System Configuration',
            created_at: '2023-08-08T12:28:34.007Z',
          },
          {
            id: 2,
            name: 'CRM',
            created_at: '2023-08-08T12:28:34.249Z',
          },
        ],
      },
    };

    it('should update a tenant', async () => {
      jest.spyOn(tenantService, 'update').mockResolvedValue(updatedTenant);

      const result = await tenantController.update(tenantId, tenantData);
      expect(result).toEqual(updatedTenant);
      expect(tenantService.update).toHaveBeenCalledWith(tenantId, tenantData);
    });
  });

  describe('listOfAllTenants', () => {
    const tenantId = BigInt(123);
    const tenantSearch = {
      page: 1,
      tenantName: '',
    };
    const tenants = {
      id: tenantId,
      tenant_name: 'test',
      tenant_domain: 'https://www.google.com/',
      admin_domain: 'https://www.google.com/',
      email: 'zejaqorol@mailinator.com',
      tenant_code: '090012',
      phone_number: '(176) 418-8179',
      is_active: true,
      password: 'Password',
      tenant_timezone: 'GMT-6',
      allow_email: false,
      created_at: new Date(),
    };

    it('should get all tenants', async () => {
      jest.spyOn(tenantService, 'findAll').mockResolvedValue(tenants);
      const result = await tenantController.findAll(tenantSearch);
      expect(result).toEqual(tenants);
      expect(tenantService.findAll).toHaveBeenCalledWith(tenantSearch);
    });
  });
  describe('update config details', () => {
    const tenantData: any = {
      tenant_name: 'hello1',
      tenant_domain: 'https://pk.godaddy.com',
      admin_domain: 'https://pk.godaddy.com/',
      email: 'test1@gmail.com',
      tenant_code: 'ASV',
      tenant_timezone: 'AST',
      phone_number: '(123) 456-7890',
      address1: 'string',
      address2: 'string',
      zip_code: '12345',
      city: 'string',
      state: 'string',
      country: 'Australia',
      password: 'Qwee233*',
      created_by: BigInt(1),
      allow_email: false,
      is_active: false,
      county: 'ASDFGH',
      coordinates: { latitude: '12.147', longitude: '-90.147' },
      forbidUnknownValues: true as const, // Update the type explicitly
      tenant_config: [
        {
          element_name: 'string',
          end_point_url: 'https://pk.godaddy.com/',
          secret_key: 'string',
          secret_value: 'string',
          created_by: BigInt(1),
        },
      ],
      applications: [
        {
          id: 1,
          name: 'System Configuration',
          created_at: '2023-08-08T12:28:34.007Z',
        },
        {
          id: 2,
          name: 'CRM',
          created_at: '2023-08-08T12:28:34.249Z',
        },
      ],
    };

    const createdTenant = {
      status: 'success',
      message: '',
      status_code: 201,
      data: {
        id: BigInt(1),
        tenant_name: 'hello4',
        tenant_domain: 'https://pk.godaddy.com',
        admin_domain: 'https://pk.godaddy.com/',
        email: 'test4@gmail.com',
        tenant_code: 'ASL',
        phone_number: '(123) 456-7890',
        is_active: false,
        password:
          '$2b$10$FR0wUqSX7WSIhAAsLB0mNOEw4hlcQ6uhQL87HAu5Cu47Sh/WCPK.S',
        tenant_timezone: 'AST',
        allow_email: true,
        created_at: new Date(),
        created_by: BigInt(1),
        addresses: [
          {
            id: BigInt(1),
            addressable_type: null,
            addressable_id: BigInt(1),
            address1: 'string',
            address2: 'string',
            zip_code: '12345',
            city: 'string',
            state: 'string',
            country: 'Australia',
            county: null,
            coordinates: { latitude: '12.147', longitude: '-90.147' },
            created_at: new Date(),
            created_by: BigInt(1),
          },
        ],
        configurations: [
          {
            id: 1,
            element_name: 'string',
            end_point_url: 'https://pk.godaddy.com/',
            secret_key: 'U2FsdGVkX1/StaIsKbrTHBVdhnQjwcivVE/oS+Sjr1o=',
            secret_value: 'U2FsdGVkX1+zBJC1Y1rNmikPONJbYhioEHHOW/DAjIU=',
            created_at: new Date(),
            created_by: BigInt(1),
            tenant_id: BigInt(1),
          },
        ],
        applications: [
          {
            id: 1,
            name: 'System Configuration',
            created_at: '2023-08-08T12:28:34.007Z',
          },
          {
            id: 2,
            name: 'CRM',
            created_at: '2023-08-08T12:28:34.249Z',
          },
        ],
      },
    };

    it('should create a new tenant', async () => {
      jest.spyOn(tenantService, 'create').mockResolvedValue(createdTenant);

      const result = await tenantController.create(tenantData);
      expect(result).toEqual(createdTenant);
      expect(tenantService.create).toHaveBeenCalledWith(tenantData);
    });
  });
});
