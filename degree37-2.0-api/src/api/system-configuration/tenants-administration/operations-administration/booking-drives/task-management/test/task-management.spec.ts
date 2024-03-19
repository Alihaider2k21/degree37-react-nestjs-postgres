import { TaskManagementModule } from '../task-management.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { testingModuleConfigs } from '../../../../../../../../test/utils';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { TenantModule } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/tenant.module';

describe.skip('Task Management', () => {
  let app: INestApplication;
  let tenantRepository: any;
  let userRepository: any;
  let loggedInUser: any;
  let tenant: any;
  let jwtService: any;
  let access_token: any;
  let task_id: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TaskManagementModule,
        TenantModule,
        TypeOrmModule.forRoot(testingModuleConfigs()),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60s' },
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    tenantRepository = module.get('TenantRepository');
    userRepository = module.get('UserRepository');
    jwtService = module.get<JwtService>(JwtService);

    tenant = await tenantRepository.save({
      tenant_name: 'test',
      tenant_domain: 'https://test.com',
      admin_domain: 'https://test.com',
      tenant_code: 'test',
      phone_number: '036548522',
      password: '123456789',
      email: 'jd@test.com',
      is_active: true,
    });

    loggedInUser = await userRepository.save({
      first_name: 'John',
      last_name: 'Doe',
      unique_identifier: 'jd',
      email: 'jd@test.com',
      is_active: true,
      tenant: tenant.id,
    });

    access_token = jwtService.sign({
      email: loggedInUser?.email,
      id: loggedInUser?.id,
    });

    await app.init();
  });

  describe('- Validate user before creating task', () => {
    it('It Should Authenticate user Before Creating Task', async () => {
      const { status } = await supertest
        .agent(app.getHttpServer())
        .post('/booking-drive/task')
        .send({})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(status).toEqual(401);
    });
  });

  it('Should validate Task create request', async () => {
    const { body, status } = await supertest
      .agent(app.getHttpServer())
      .post('/booking-drive/task')
      .set('Authorization', `Bearer ${access_token}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(status).toEqual(400);
    expect(body.message).toEqual([
      'name must be a string',
      'name should not be empty',
      'description must be a string',
      'description should not be empty',
      'offset must be an integer number',
      'offset should not be empty',
      'owner must be one of the following values: Recruiters, Schedulers, Lead Telerecruiter',
      'applies_to must be one of the following values: Accounts, Locations, Donor Centers, Donors, Staff, Volunteers, Drives, Sessions, NCEs',
      'is_active must be a boolean value',
      'is_active should not be empty',
      'created_by must be an integer number',
      'created_by should not be empty',
      'collection_operation should not be empty',
    ]);
  });

  it('Should create a Task', async () => {
    const taskData: any = {
      name: 'Test',
      description: 'Testing',
      offset: 1,
      owner: 'Recruiters',
      applies_to: 'Accounts',
      is_active: true,
      created_by: parseInt(loggedInUser.id),
      collection_operation: 'Test',
    };

    const { body, status } = await supertest
      .agent(app.getHttpServer())
      .post('/booking-drive/task')
      .send(taskData)
      .set('Authorization', `Bearer ${access_token}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(status).toEqual(201);
    task_id = body.data.id;
    expect(body.data.name).toEqual(taskData.name);
    expect(body.data.description).toEqual(taskData.description);
  });

  describe('- Retrieve Tasks', () => {
    it('Should return an array of Tasks ', async () => {
      const { body } = await supertest
        .agent(app.getHttpServer())
        .get('/booking-drive/task')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${access_token}`)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.data).toHaveLength(1);
      expect(body.data[0].name).toEqual('Test');
      expect(body.data[0].description).toEqual('Testing');
    });
  });

  describe('- Retrieve Task', () => {
    it('Should return a specific Task', async () => {
      const { body } = await supertest
        .agent(app.getHttpServer())
        .get(`/booking-drive/task/${task_id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${access_token}`)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(body.data.name).toEqual('Test');
      expect(body.data.description).toEqual('Testing');
    });
  });

  describe('- update task', () => {
    it('Should Update a Task', async () => {
      const taskData: any = {
        name: 'Test updated',
        description: 'testing updated',
      };
      const { body, status } = await supertest
        .agent(app.getHttpServer())
        .put(`/booking-drive/task/${task_id}`)
        .send(taskData)
        .set('Authorization', `Bearer ${access_token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(status).toEqual(200);
      expect(body.data.name).toEqual(taskData.name);
      expect(body.data.description).toEqual(taskData.description);
    });
  });

  describe('- Archive Task', () => {
    it('Should archive an task', async () => {
      const { body, status } = await supertest
        .agent(app.getHttpServer())
        .patch(`/booking-drive/task/archive/${task_id}`)
        .set('Authorization', `Bearer ${access_token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(body.status_code).toEqual(204);
      expect(body.data.is_archive).toEqual(true);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
