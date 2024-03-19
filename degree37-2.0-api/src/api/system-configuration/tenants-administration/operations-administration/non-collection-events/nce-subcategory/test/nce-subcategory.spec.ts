import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { NceCategoryModule } from '../../nce-category/nce-category.module';
import { NceSubCategoryModule } from '../nce-subcategory.module';
import { testingModuleConfigs } from '../../../../../../../../test/utils';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { TenantModule } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/tenant.module';
import { Repository } from 'typeorm';
import { Category } from 'src/api/system-configuration/tenants-administration/crm-administration/common/entity/category.entity';
import { typeEnum } from 'src/api/system-configuration/tenants-administration/crm-administration/common/enums/type.enum';

describe.skip('NCE Sub category', () => {
  let app: INestApplication;
  let tenantRepository: any;
  let userRepository: any;
  let noteCategoryRepository: Repository<Category>;
  let loggedInUser: any;
  let tenant: any;
  let jwtService: any;
  let access_token: any;
  let subcategory_id: any;
  let note: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        NceCategoryModule,
        NceSubCategoryModule,
        TenantModule,
        TypeOrmModule.forRoot(testingModuleConfigs()),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [
        {
          provide: getRepositoryToken(Category),
          useValue: Repository<Category>,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    tenantRepository = module.get('TenantRepository');
    userRepository = module.get('UserRepository');
    noteCategoryRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category)
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

    note = await noteCategoryRepository.save({
      name: 'Test',
      description: 'Test',
      type: typeEnum?.OPERATION_NEC_NEC,
      is_active: true,
      created_by: loggedInUser,
      tenant: tenant,
    });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('- Validate user before creating NCE Sub category', () => {
    it('It Should Authenticate user Before Creating NCE Sub category', async () => {
      const { status } = await supertest
        .agent(app.getHttpServer())
        .post('/nce-subcategory')
        .send({})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(status).toEqual(401);
    });
  });

  it('Should validate NCE Sub Category create request', async () => {
    const { body, status } = await supertest
      .agent(app.getHttpServer())
      .post('/nce-subcategory')
      .set('Authorization', `Bearer ${access_token}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);
    expect(status).toEqual(400);
    expect(body.message).toEqual([
      'Note Category name must be a string',
      'Note Category name is required',
      'is_active must be a boolean value',
      'Is active is required',
      'Parent id must be a bigint value',
      'Parent id is required',
    ]);
  });

  it('Should create a NCE Sub category', async () => {
    const noteData: any = {
      name: 'Test',
      description: 'Testing',
      is_active: true,
      parent_id: parseInt(note.id),
    };

    const { body, status } = await supertest
      .agent(app.getHttpServer())
      .post('/nce-subcategory')
      .send(noteData)
      .set('Authorization', `Bearer ${access_token}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(status).toEqual(201);
    subcategory_id = body.data.savednotecategory.id;
    expect(body.data.savednotecategory.name).toEqual(noteData.name);
    expect(body.data.savednotecategory.description).toEqual(
      noteData.description
    );
  });

  describe('- Retrieve NCE Categories', () => {
    it('Should return an array of NCE Category', async () => {
      const { body } = await supertest
        .agent(app.getHttpServer())
        .get('/nce-subcategory')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${access_token}`)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(Array.isArray(body.data.data)).toBe(true);
      expect(body.data.data).toHaveLength(1);
      expect(body.data.data[0].name).toEqual('Test');
      expect(body.data.data[0].description).toEqual('Testing');
    });
  });

  describe('- Retrieve NCE Category', () => {
    it('Should return a specific NCE Category', async () => {
      const { body } = await supertest
        .agent(app.getHttpServer())
        .get(`/nce-subcategory/${subcategory_id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${access_token}`)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(body.data.name).toEqual('Test');
      expect(body.data.description).toEqual('Testing');
    });
  });

  describe('- update NCE category', () => {
    it('Should Update a NCE Category', async () => {
      const noteData: any = {
        name: 'Test updated',
        description: 'testing updated',
      };
      const { body, status } = await supertest
        .agent(app.getHttpServer())
        .put(`/nce-subcategory/${subcategory_id}`)
        .send(noteData)
        .set('Authorization', `Bearer ${access_token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(status).toEqual(200);
      expect(body.data.name).toEqual(noteData.name);
      expect(body.data.description).toEqual(noteData.description);
    });
  });

  describe('- Archive NCE Category', () => {
    it('Should archive an NCE Category', async () => {
      const { body, status } = await supertest
        .agent(app.getHttpServer())
        .patch(`/nce-subcategory/${subcategory_id}`)
        .set('Authorization', `Bearer ${access_token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(body.data.is_archived).toEqual(true);
    });
  });
});
