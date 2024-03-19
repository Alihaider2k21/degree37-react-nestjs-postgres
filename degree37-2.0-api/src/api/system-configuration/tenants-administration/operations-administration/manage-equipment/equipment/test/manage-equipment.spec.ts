import { OrganizationalLevels } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/organizational-levels/entities/organizational-level.entity';
import { OrganizationalLevelModule } from '../../../../organizational-administration/hierarchy/organizational-levels/organizational-levels.module';
import { EquipmentModule } from '../equipment.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { testingModuleConfigs } from '../../../../../../../../test/utils';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { TenantModule } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/tenant.module';
import { Repository } from 'typeorm';
import { BusinessUnits } from 'src/api/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/entities/business-units.entity';

describe.skip('Manage Equipment', () => {
  let app: INestApplication;
  let tenantRepository: any;
  let userRepository: any;
  let organizationalLevelsRepository: Repository<OrganizationalLevels>;
  let businessUnitsRepository: Repository<BusinessUnits>;

  let loggedInUser: any;
  let tenant: any;
  let jwtService: any;
  let access_token: any;
  let organizationLevel: any;
  let businessUnit: any;
  let equipment_id: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        EquipmentModule,
        TenantModule,
        OrganizationalLevelModule,
        TypeOrmModule.forRoot(testingModuleConfigs()),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [
        {
          provide: getRepositoryToken(OrganizationalLevels),
          useValue: Repository<OrganizationalLevels>,
        },
        {
          provide: getRepositoryToken(BusinessUnits),
          useValue: Repository<BusinessUnits>,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    tenantRepository = module.get('TenantRepository');
    userRepository = module.get('UserRepository');
    organizationalLevelsRepository = module.get<
      Repository<OrganizationalLevels>
    >(getRepositoryToken(OrganizationalLevels));
    businessUnitsRepository = module.get<Repository<BusinessUnits>>(
      getRepositoryToken(BusinessUnits)
    );
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

    organizationLevel = await organizationalLevelsRepository.save({
      name: 'Test Ogranization',
      short_label: 'test label',
      description: 'Test description',
      is_active: true,
      created_by: tenant.id,
      parent_level: null,
      tenant: tenant.id,
    });

    businessUnit = await businessUnitsRepository.save({
      name: 'Test business',
      is_active: true,
      created_by: tenant.id,
      parent_level: null,
      organizational_level_id: organizationLevel.id,
      tenant_id: tenant.id,
      is_archived: false,
    });

    await app.init();
  });

  describe('- Validate user before creating equipment', () => {
    it('It Should Authenticate user Before Creating equipment', async () => {
      const { status } = await supertest
        .agent(app.getHttpServer())
        .post('/marketing-equipment/equipment')
        .send({})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(status).toEqual(401);
    });
  });

  it('Should validate Equipment create request', async () => {
    const { body, status } = await supertest
      .agent(app.getHttpServer())
      .post('/marketing-equipment/equipment')
      .set('Authorization', `Bearer ${access_token}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(status).toEqual(400);
    expect(body.message).toEqual([
      'Name must be a string',
      'Name is required',
      'Short Name must be a string',
      'Short Name is required',
      'Description must be a string',
      'Description is required',
      'Collection Operations must be an integer array',
      'Collection Operations should not be empty',
      'Retire on date should not be empty',
      'retire_on must be a string',
    ]);
  });

  it('Should create a equipment', async () => {
    const equipmentData: any = {
      name: 'Test',
      short_name: 'ts',
      description: 'Testing',
      collection_operations: [businessUnit.id],
      retire_on: '2023-09-07',
      is_active: true,
    };

    const { body, status } = await supertest
      .agent(app.getHttpServer())
      .post('/marketing-equipment/equipment')
      .send(equipmentData)
      .set('Authorization', `Bearer ${access_token}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);
    expect(status).toEqual(201);
    equipment_id = parseInt(body.data.savedEquipment.id);
    expect(body.data.savedEquipment.name).toEqual(equipmentData.name);
    expect(body.data.savedEquipment.description).toEqual(
      equipmentData.description
    );
  });

  describe('- Retrieve Equipments', () => {
    it('Should return an array of Equipments ', async () => {
      const { body } = await supertest
        .agent(app.getHttpServer())
        .get('/marketing-equipment/equipment')
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

  describe('- Retrieve Equipment', () => {
    it('Should return a specific Equipment', async () => {
      const { body } = await supertest
        .agent(app.getHttpServer())
        .get(`/marketing-equipment/equipment/${equipment_id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${access_token}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(body.data.name).toEqual('Test');
      expect(body.data.description).toEqual('Testing');
    });
  });

  describe('- update Equipment', () => {
    it('Should Update a Equipment', async () => {
      const equipment: any = {
        id: equipment_id,
        name: 'Test updated',
        description: 'testing updated',
      };
      const { body, status } = await supertest
        .agent(app.getHttpServer())
        .put(`/marketing-equipment/equipment/${equipment_id}`)
        .send(equipment)
        .set('Authorization', `Bearer ${access_token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);
      console.log('updatee', body);

      expect(body.status_code).toEqual(204);
    });
  });

  describe('- Archive Equipment', () => {
    it('Should archive an Equipment', async () => {
      const { body, status } = await supertest
        .agent(app.getHttpServer())
        .patch(`/marketing-equipment/equipment/archive/${equipment_id}`)
        .set('Authorization', `Bearer ${access_token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      console.log('Eq', body);
      expect(body.status_code).toEqual(204);
      expect(body.updatedEquipment.is_archived).toEqual(true);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
