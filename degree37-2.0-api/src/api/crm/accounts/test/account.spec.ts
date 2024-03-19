import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { AccountsModule } from '../accounts.module';
import { BusinessUnitModule } from '../../../system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/business-units.module';
import { testingModuleConfigs } from '../../../../../test/utils';
import { IndustryCategoriesModule } from '../../../system-configuration/tenants-administration/crm-administration/account/industry-categories/industry-categories.module';
import { StagesModule } from '../../../system-configuration/tenants-administration/crm-administration/account/stages/stages.module';
import { SourcesModule } from '../../../system-configuration/tenants-administration/crm-administration/account/sources/sources.module';
import { TerritoriesModule } from '../../../system-configuration/tenants-administration/geo-administration/territories/territories.module';
import { RolePermissionsModule } from '../../../system-configuration/platform-administration/roles-administration/role-permissions/role-permissions.module';
import { CRMVolunteerModule } from '../../contacts/volunteer/crm-volunteer.module';
import { ClassificationModule } from 'src/api/system-configuration/tenants-administration/staffing-administration/classifications/classification.module';
import { StaffModule } from '../../contacts/staff/staff.module';
import { AffiliationModule } from 'src/api/system-configuration/tenants-administration/crm-administration/account/affiliation/affiliation.module';
import { JwtService, JwtModule } from '@nestjs/jwt';

describe.skip('Accounts CRUD', () => {
  let app: INestApplication;
  let tenantRepository: any;
  let userRepository: any;
  let businessUnitsRepository: any;
  let industryCategoryRepository: any;
  let stageRepository: any;
  let SourceRepository: any;
  let territoryRepository: any;
  let rolesRepository: any;
  let contactsRolesRepository: any;
  let loggedInUser: any;
  let collectionOperation: any;
  let role: any;
  let recruiter: any;
  let industryCategory: any;
  let subIndustryCategory: any;
  let stage: any;
  let source: any;
  let territory: any;
  let tenant: any;
  let contactRepository: any;
  let contact: any;
  let contact_role: any;
  let classificationRepository: any;
  let classification: any;
  let staffRepository: any;
  let allStaff: any;
  let affiliationRepository: any;
  let affiliation: any;
  let jwtService: any;
  let access_token: any;
  let account_id: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        AccountsModule,
        IndustryCategoriesModule,
        StagesModule,
        BusinessUnitModule,
        SourcesModule,
        TerritoriesModule,
        RolePermissionsModule,
        CRMVolunteerModule,
        ClassificationModule,
        StaffModule,
        AffiliationModule,
        TypeOrmModule.forRoot(testingModuleConfigs()),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [JwtService],
    }).compile();
    app = module.createNestApplication();
    tenantRepository = module.get('TenantRepository');
    userRepository = module.get('UserRepository');
    businessUnitsRepository = module.get('BusinessUnitsRepository');
    industryCategoryRepository = module.get('IndustryCategoriesRepository');
    stageRepository = module.get('StagesRepository');
    SourceRepository = module.get('SourcesRepository');
    territoryRepository = module.get('TerritoryRepository');
    rolesRepository = module.get('RolesRepository');
    contactsRolesRepository = module.get('ContactsRolesRepository');
    contactRepository = module.get('CRMVolunteerRepository');
    classificationRepository = module.get('StaffingClassificationRepository');
    staffRepository = module.get('StaffRepository');
    affiliationRepository = module.get('AffiliationRepository');
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
    role = await rolesRepository.save({
      name: 'Manager',
      description: 'Manage the full application',
      is_active: true,
      is_archived: false,
      created_by: loggedInUser.id,
      is_recruiter: true,
    });
    recruiter = await userRepository.save({
      first_name: 'Danny',
      last_name: 'Johns',
      unique_identifier: 'dj',
      email: 'dj@test.com',
      is_active: true,
      role: role.id,
      tenant: tenant.id,
    });
    industryCategory = await industryCategoryRepository.save({
      name: 'Industry Category 1',
      description: 'Testing',
      is_active: true,
      is_archived: false,
      created_by: loggedInUser.id,
      tenant_id: tenant.id,
    });
    subIndustryCategory = await industryCategoryRepository.save({
      name: 'Sub Industry Category 1',
      description: 'Testing',
      is_active: true,
      is_archived: false,
      created_by: loggedInUser.id,
      parent_id: industryCategory.id,
      tenant_id: tenant.id,
    });
    stage = await stageRepository.save({
      name: 'Stage 1',
      description: 'Testing',
      is_active: true,
      is_archived: false,
      created_by: loggedInUser.id,
      tenant_id: tenant.id,
    });
    source = await SourceRepository.save({
      name: 'Source 1',
      description: 'Testing',
      is_active: true,
      is_archived: false,
      created_by: loggedInUser.id,
      tenant_id: tenant.id,
    });
    territory = await territoryRepository.save({
      territory_name: 'Territory 1',
      description: 'Testing',
      is_active: true,
      is_archived: false,
      created_by: loggedInUser.id,
      recruiter: recruiter.id,
      tenant_id: tenant.id,
    });
    collectionOperation = await businessUnitsRepository.save({
      name: 'Test',
      organizational_level_id: null,
      parent_level: null,
      created_by: loggedInUser.id,
      tenant_id: tenant.id,
    });
    contact_role = await contactsRolesRepository.save({
      name: 'Manager',
      description: 'Manage the full application',
      function_id: 3,
      average_hourly_rate: 0,
      oef_contribution: 0,
      impacts_oef: 0,
      staffable: false,
      status: true,
      is_archived: false,
      created_by: loggedInUser.id,
      tenant_id: tenant.id,
    });
    contact = await contactRepository.save({
      title: 'Test Contact',
      employee: 'abcd',
      first_name: 'Micky',
      last_name: 'Mouse',
      birth_date: '1998-08-07 19:00:00',
      created_by: loggedInUser.id,
      tenant_id: tenant.id,
    });
    classification = await classificationRepository.save({
      name: 'Test Classification',
      short_description: 'abcd',
      description: 'qwerty',
      status: true,
      created_by: loggedInUser.id,
      tenant: tenant.id,
    });
    allStaff = await staffRepository.save({
      first_name: 'Test',
      last_name: 'Staff',
      classification_id: classification.id,
      collection_operation_id: collectionOperation.id,
      birth_date: '2023-09-23 14:03:02.340036',
      created_by: loggedInUser.id,
      tenant_id: tenant.id,
    });
    affiliation = await affiliationRepository.save({
      name: 'Test affiliation',
      description: 'qwerty',
      is_active: true,
      collection_operation_id: collectionOperation.id,
      created_by: loggedInUser.id,
      tenant_id: tenant.id,
    });
    access_token = jwtService.sign({
      email: loggedInUser?.email,
      id: loggedInUser?.id,
    });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('- Create Account', () => {
    it('Should authenticate user before creating a account', async () => {
      const { status } = await supertest
        .agent(app.getHttpServer())
        .post('/accounts')
        .send({})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(status).toEqual(401);
    });

    it('Should validate account create request', async () => {
      const { body, status } = await supertest
        .agent(app.getHttpServer())
        .post('/accounts')
        .set('Authorization', `Bearer ${access_token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(status).toEqual(400);
      expect(body.message).toEqual([
        'Name must be a string',
        'Name is required',
        'Mailing address must be a string',
        'Mailing address is required',
        'Industry Category must be an integer number',
        'Industry Category should not be empty',
        'Industry Sub Category must be an integer number',
        'Industry Sub Category should not be empty',
        'Stage must be an integer number',
        'Stage should not be empty',
        'Source must be an integer number',
        'Source should not be empty',
        'Collection Operation must be an integer number',
        'Collection Operation should not be empty',
      ]);
    });

    it('Should not allow to create a account with contact', async () => {
      const accountData: any = {
        name: 'Test 1',
        alternate_name: 'Test 1',
        mailing_address: 'test1 st 1',
        address2: 'main Street',
        county: 'test',
        latitude: 456.25,
        longitude: 4876.25,
        zip_code: 54750,
        city: 'Unknown',
        state: 'Unknown',
        country: 'Unknown',
        phone: '(123) 456-7890',
        website: 'https://www.facebook.com/',
        facebook: 'https://www.facebook.com/',
        industry_category: +industryCategory.id,
        industry_subcategory: +subIndustryCategory.id,
        stage: +stage.id,
        source: +source.id,
        BECS_code: '50001',
        collection_operation: +collectionOperation.id,
        recruiter: +recruiter.id,
        territory: +territory.id,
        population: 123.5,
        is_active: true,
        RSMO: false,
        created_by: +loggedInUser.id,
        contacts: [],
        deleteContacts: [],
      };

      const { body } = await supertest
        .agent(app.getHttpServer())
        .post('/accounts')
        .send(accountData)
        .set('Authorization', `Bearer ${access_token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(body.statusCode).toEqual(400);
      expect(body.message).toEqual(
        'Atleast one contact is required to create a account.'
      );
    });

    it('Should create a account', async () => {
      const accountData: any = {
        name: 'Test 1',
        alternate_name: 'Test 1',
        mailing_address: 'test1 st 1',
        address2: 'main Street',
        county: 'test',
        latitude: 456.25,
        longitude: 4876.25,
        zip_code: 54750,
        city: 'Unknown',
        state: 'Unknown',
        country: 'Unknown',
        phone: '(123) 456-7890',
        website: 'https://www.facebook.com/',
        facebook: 'https://www.facebook.com/',
        industry_category: +industryCategory.id,
        industry_subcategory: +subIndustryCategory.id,
        stage: +stage.id,
        source: +source.id,
        BECS_code: '50001',
        collection_operation: +collectionOperation.id,
        recruiter: +recruiter.id,
        territory: +territory.id,
        population: 123.5,
        is_active: true,
        RSMO: false,
        created_by: +loggedInUser.id,
        contacts: [
          {
            contactable_type: 'accounts',
            record_id: contact.id,
            role_id: contact_role.id,
          },
        ],
        deleteContacts: [],
      };

      const { body, status } = await supertest
        .agent(app.getHttpServer())
        .post('/accounts')
        .send(accountData)
        .set('Authorization', `Bearer ${access_token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      account_id = body.data.id;
      expect(status).toEqual(201);
      expect(body.data.name).toEqual(accountData.name);
      expect(body.data.is_active).toEqual(accountData.is_active);
      expect(body.data).toHaveProperty('address');
      expect(+body.data.created_by.id).toEqual(accountData.created_by);
    });
  });

  describe('- Retrieve accounts', () => {
    it('Should authenticate user before retrieving accounts', async () => {
      const { status } = await supertest
        .agent(app.getHttpServer())
        .get('/accounts?fetchAll=true')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(status).toEqual(401);
    });

    it('Should return an array of accounts', async () => {
      const { body } = await supertest
        .agent(app.getHttpServer())
        .get('/accounts?fetchAll=true')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${access_token}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(body.data).toHaveLength(1);
      expect(body.data[0].name).toEqual('Test 1');
      expect(body.data[0].is_active).toEqual(true);
      expect(body.data[0].created_by.id).toEqual(loggedInUser.id);
    });

    it('Should return a sorted array of accounts', async () => {
      const { body } = await supertest
        .agent(app.getHttpServer())
        .get('/accounts?fetchAll=true&SortName=city&SortBy=desc')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${access_token}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(body.data).toHaveLength(1);
      expect(body.data[0].name).toEqual('Test 1');
      expect(body.data[0].is_active).toEqual(true);
      expect(body.data[0].created_by.id).toEqual(loggedInUser.id);
    });

    it('Should return a searched array of accounts', async () => {
      const { body } = await supertest
        .agent(app.getHttpServer())
        .get('/accounts?keyword=test')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${access_token}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(body.data).toHaveLength(1);
      expect(body.data[0].name).toEqual('Test 1');
      expect(body.data[0].is_active).toEqual(true);
      expect(body.data[0].created_by.id).toEqual(loggedInUser.id);
    });

    it('Should return empty array if no accounts match search criteria', async () => {
      const { body } = await supertest
        .agent(app.getHttpServer())
        .get('/accounts?keyword=asd')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${access_token}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(body.data).toHaveLength(0);
    });

    it('Should return a filtered array of accounts', async () => {
      const { body } = await supertest
        .agent(app.getHttpServer())
        .get(`/accounts?collectionOperation=${collectionOperation.id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${access_token}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(body.data).toHaveLength(1);
      expect(body.data[0].name).toEqual('Test 1');
      expect(body.data[0].is_active).toEqual(true);
      expect(body.data[0].created_by.id).toEqual(loggedInUser.id);
    });

    it('Should return empty array if no accounts match filter criteria', async () => {
      const { body } = await supertest
        .agent(app.getHttpServer())
        .get('/accounts?collectionOperation=-1')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${access_token}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(body.data).toHaveLength(0);
    });
  });

  describe('- Update account', () => {
    it('Should authenticate user before updating account', async () => {
      const { status } = await supertest
        .agent(app.getHttpServer())
        .put(`/accounts/${account_id}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(status).toEqual(401);
    });

    it('Should validate account before updating it', async () => {
      const accountData: any = {
        name: 'Test 2',
        alternate_name: 'Test 1',
        mailing_address: 'test1 st 1',
        address2: 'main Street',
        county: 'test',
        latitude: 456.25,
        longitude: 4876.25,
        zip_code: 54750,
        city: 'Unknown',
        state: 'Unknown',
        country: 'Unknown',
        phone: '(123) 456-7890',
        website: 'https://www.facebook.com/',
        facebook: 'https://www.facebook.com/',
        industry_category: +industryCategory.id,
        industry_subcategory: +subIndustryCategory.id,
        stage: +stage.id,
        source: +source.id,
        BECS_code: '50001',
        collection_operation: +collectionOperation.id,
        recruiter: +recruiter.id,
        territory: +territory.id,
        population: 123.5,
        is_active: true,
        RSMO: false,
        created_by: +loggedInUser.id,
        contacts: [],
        deleteContacts: [],
      };

      const { body } = await supertest
        .agent(app.getHttpServer())
        .put(`/accounts/-1`)
        .send(accountData)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${access_token}`)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(body.status_code).toEqual(404);
      expect(body.response).toEqual('Account not found.');
    });

    it('Should remove contact from account', async () => {
      const accountData: any = {
        name: 'Test 2',
        alternate_name: 'Test 1',
        mailing_address: 'test1 st 1',
        address2: 'main Street',
        county: 'test',
        latitude: 456.25,
        longitude: 4876.25,
        zip_code: 54750,
        city: 'Unknown',
        state: 'Unknown',
        country: 'Unknown',
        phone: '(123) 456-7890',
        website: 'https://www.facebook.com/',
        facebook: 'https://www.facebook.com/',
        industry_category: +industryCategory.id,
        industry_subcategory: +subIndustryCategory.id,
        stage: +stage.id,
        source: +source.id,
        BECS_code: '50001',
        collection_operation: +collectionOperation.id,
        recruiter: +recruiter.id,
        territory: +territory.id,
        population: 123.5,
        is_active: true,
        RSMO: false,
        created_by: +loggedInUser.id,
        contacts: [],
        deleteContacts: [contact.id],
      };

      const { body, status } = await supertest
        .agent(app.getHttpServer())
        .put(`/accounts/${account_id}`)
        .send(accountData)
        .set('Authorization', `Bearer ${access_token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(status).toEqual(201);
      expect(body.data.name).toEqual(accountData.name);
      expect(body.data.is_active).toEqual(accountData.is_active);
      expect(+body.data.created_by.id).toEqual(accountData.created_by);

      const res = await supertest
        .agent(app.getHttpServer())
        .get(`/accounts/${account_id}/account-contacts?is_current=true`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${access_token}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body.data).toHaveLength(0);
    });

    it('Should update an account', async () => {
      const accountData: any = {
        name: 'Test 2',
        alternate_name: 'Test 1',
        mailing_address: 'test1 st 1',
        address2: 'main Street',
        county: 'test',
        latitude: 456.25,
        longitude: 4876.25,
        zip_code: 54750,
        city: 'Unknown',
        state: 'Unknown',
        country: 'Unknown',
        phone: '(123) 456-7890',
        website: 'https://www.facebook.com/',
        facebook: 'https://www.facebook.com/',
        industry_category: +industryCategory.id,
        industry_subcategory: +subIndustryCategory.id,
        stage: +stage.id,
        source: +source.id,
        BECS_code: '50001',
        collection_operation: +collectionOperation.id,
        recruiter: +recruiter.id,
        territory: +territory.id,
        population: 123.5,
        is_active: true,
        RSMO: false,
        created_by: +loggedInUser.id,
        contacts: [
          {
            contactable_type: 'accounts',
            record_id: contact.id,
            role_id: contact_role.id,
          },
        ],
        deleteContacts: [],
      };

      const { body, status } = await supertest
        .agent(app.getHttpServer())
        .put(`/accounts/${account_id}`)
        .send(accountData)
        .set('Authorization', `Bearer ${access_token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(status).toEqual(201);
      expect(body.data.name).toEqual(accountData.name);
      expect(body.data.is_active).toEqual(accountData.is_active);
      expect(body.data).toHaveProperty('address');
      expect(+body.data.created_by.id).toEqual(accountData.created_by);
    });
  });

  describe('- Retrieve account', () => {
    it('Should authenticate user before retrieving account', async () => {
      const { status } = await supertest
        .agent(app.getHttpServer())
        .get(`/accounts/${account_id}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(status).toEqual(401);
    });

    it('Should validate account before returning it', async () => {
      const { body } = await supertest
        .agent(app.getHttpServer())
        .get(`/accounts/-1`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${access_token}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(body.status_code).toEqual(404);
      expect(body.response).toEqual('Account not found.');
    });

    it('Should return a account', async () => {
      const { body } = await supertest
        .agent(app.getHttpServer())
        .get(`/accounts/${account_id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${access_token}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(body.data.name).toEqual('Test 2');
      expect(body.data.is_active).toEqual(true);
      expect(body.data).toHaveProperty('address');
      expect(body.data.created_by.id).toEqual(loggedInUser.id);
    });

    it('Should return account modification data from history', async () => {
      const { body } = await supertest
        .agent(app.getHttpServer())
        .get(`/accounts/${account_id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${access_token}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(body.data.name).toEqual('Test 2');
      expect(body.data.is_active).toEqual(true);
      expect(body.data).toHaveProperty('address');
      expect(body.data.created_at).not.toEqual(body.data.modified_at);
    });

    it('Should return account contacts', async () => {
      const { body } = await supertest
        .agent(app.getHttpServer())
        .get(`/accounts/${account_id}/account-contacts?is_current=true`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${access_token}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(body.data).toHaveLength(1);
      expect(body.data[0].contactable_type).toEqual('accounts');
      expect(body.data[0].contactable_id.id).toEqual(account_id);
      expect(body.data[0].record_id.id).toEqual(contact.id);
      expect(body.data[0].role_id.id).toEqual(contact_role.id);
      expect(body.data[0].closeout_date).toBeNull();
    });
  });

  describe('- Archive account', () => {
    it('Should authenticate user before archiving account', async () => {
      const { status } = await supertest
        .agent(app.getHttpServer())
        .delete(`/accounts/${account_id}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(status).toEqual(401);
    });

    it('Should validate account before archiving it', async () => {
      const { body } = await supertest
        .agent(app.getHttpServer())
        .delete(`/accounts/-1`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${access_token}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(body.status_code).toEqual(404);
      expect(body.response).toEqual('Account not found.');
    });

    it('Should archive an account', async () => {
      const { body } = await supertest
        .agent(app.getHttpServer())
        .delete(`/accounts/${account_id}`)
        .set('Authorization', `Bearer ${access_token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(body.data.is_archived).toEqual(true);
    });
  });

  describe('- Account seed data', () => {
    it('Should authenticate user before returing account seed data', async () => {
      const { status } = await supertest
        .agent(app.getHttpServer())
        .get(`/accounts/upsert/seed-data`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(status).toEqual(401);
    });

    it('Should return account seed data', async () => {
      const { body } = await supertest
        .agent(app.getHttpServer())
        .get(`/accounts/upsert/seed-data`)
        .set('Authorization', `Bearer ${access_token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(body.data).toHaveProperty('industryCategories');
      expect(body.data.industryCategories).toHaveLength(1);
      expect(body.data).toHaveProperty('industrySubCategories');
      expect(body.data.industrySubCategories).toHaveLength(1);
      expect(body.data).toHaveProperty('stages');
      expect(body.data.stages).toHaveLength(1);
      expect(body.data).toHaveProperty('sources');
      expect(body.data.sources).toHaveLength(1);
      expect(body.data).toHaveProperty('businessUnits');
      expect(body.data.businessUnits).toHaveLength(0);
      expect(body.data).toHaveProperty('recruiters');
      expect(body.data.recruiters).toHaveLength(0);
      expect(body.data).toHaveProperty('territories');
      expect(body.data.territories).toHaveLength(1);
    });
  });
});
