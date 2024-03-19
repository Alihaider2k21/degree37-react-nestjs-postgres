import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { TenantModule } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/tenant.module';
import { testingModuleConfigs } from 'test/utils';
import { StaffSchedulesService } from '../../services/staff-schedules.service';
import { FilterStaffSchedulesInterface } from '../interfaces/filter-staff-schedules';
import { StaffSchedulesController } from '../controller/staff-schedules.controller';
import { entities } from 'src/database/entities/entity';
import { StaffingManagementModule } from '../../staffing-management.module';

describe('Staff Schedules', () => {
  let app: INestApplication;
  let tenantRepository: any;
  let userRepository: any;
  let loggedInUser: any;
  let jwtService: any;
  let access_token: any;
  let tenant: any;
  let controller: StaffSchedulesController;
  let service: StaffSchedulesService;
  let mockData: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [StaffSchedulesController],
      providers: [
        {
          provide: StaffSchedulesService,
          useValue: {
            get: jest.fn(),
            search: jest.fn(),
          },
        },
      ],
      imports: [
        StaffingManagementModule,
        TenantModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT),
          username: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.TEST_DB_NAME,
          entities: entities,
          logging: ['error'],
          synchronize: true,
          dropSchema: true,
          migrationsTableName: 'migrations',
          migrations: ['src/database/migrations/*.ts'],
        }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60s' },
        }),
      ],
    }).compile();

    tenantRepository = module.get('TenantRepository');
    userRepository = module.get('UserRepository');

    controller = module.get<StaffSchedulesController>(StaffSchedulesController);
    service = module.get<StaffSchedulesService>(StaffSchedulesService);
    jwtService = module.get<JwtService>(JwtService);

    app = module.createNestApplication();

    tenant = await tenantRepository.save({
      tenant_name: 'test',
      tenant_domain: 'https://test.com',
      admin_domain: 'https://test.com',
      tenant_code: 'test',
      phone_number: '036548522',
      password: '123456789',
      email: 'jd@test.com',
      is_active: true,
      created_by: 1,
    });

    loggedInUser = await userRepository.save({
      first_name: 'John',
      last_name: 'Doe',
      unique_identifier: 'jd',
      email: 'jd@test.com',
      is_active: true,
      tenant: tenant.id,
      created_by: 1,
    });

    access_token = jwtService.sign({
      email: loggedInUser?.email,
      id: loggedInUser?.id,
    });

    mockData = {
      status: 'success',
      response: 'Staff Schedule fetched successfully.',
      code: 200,
      record_count: 2,
      data: [
        {
          staff_id: 203,
          staff_name: 'Haris Zahid',
          role_name: 'littel rock',
          total_hours: 12,
          shift_start_time: '2023-11-10T02:52:00.000Z',
          shift_end_time: '2023-11-10T06:58:00.000Z',
          return_time: '2023-11-10T03:04:00.000Z',
          depart_time: '2023-11-10T07:05:00.000Z',
          date: null,
          account_name: null,
          is_on_leave: false,
        },
        {
          staff_id: 204,
          staff_name: 'Tariq Ibn Ziyad',
          role_name: 'Conqueror',
          total_hours: 7,
          shift_start_time: '2023-11-10T02:52:00.000Z',
          shift_end_time: '2023-11-10T06:58:00.000Z',
          return_time: '2023-11-10T03:04:00.000Z',
          depart_time: '2023-11-10T07:05:00.000Z',
          date: '2023-10-08T00:00:00.000Z',
          account_name: 'Ulhassa',
          is_on_leave: true,
        },
      ],
    };
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Get Staff Schedules', () => {
    it('it should forbid access to resources for user without STAFFING_MANAGEMENT_VIEW_SCHEDULE_STAFF_SCHEDULE permissions', async () => {
      const { status } = await supertest
        .agent(app.getHttpServer())
        .get('/view-schedules/staff-schedules')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${access_token}`)
        .expect('Content-Type', /json/);

      expect(status).toEqual(403);
    });

    it('should fetch staff schedules with the correct parameters', async () => {
      jest.spyOn(service, 'get').mockResolvedValue(mockData);

      const result = await controller.get({ page: 1, limit: 25 });

      expect(result).toEqual(mockData);
      expect(service.get).toHaveBeenCalledWith(1, 25);
    });
  });

  describe('Search Staff Schedules', () => {
    it('should fetch searched data with the correct parameters', async () => {
      const filter: FilterStaffSchedulesInterface = {
        keyword: '',
        page: 1,
        limit: 30,
        staff_id: null,
        team_id: null,
        collection_operation_id: null,
        schedule_state_date: null,
        donor_id: null,
        schedule_status_id: null,
      };

      jest.spyOn(service, 'search').mockResolvedValue(mockData);
      const result = await controller.search(filter);

      expect(result).toEqual(mockData);
      expect(service.search).toHaveBeenCalledWith(filter);
    });
  });
});
