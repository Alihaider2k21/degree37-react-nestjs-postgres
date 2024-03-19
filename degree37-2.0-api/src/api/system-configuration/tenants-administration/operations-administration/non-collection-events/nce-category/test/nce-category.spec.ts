import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { NceCategoryModule } from '../nce-category.module';
import { testingModuleConfigs } from '../../../../../../../../test/utils';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { TenantModule } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/tenant.module';

describe.skip('NCE category', () => {
  let app: INestApplication;
  let tenantRepository: any;
  let userRepository: any;
  let loggedInUser: any;
  let tenant: any;
  let jwtService: any;
  let access_token: any;
  let category_id: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        NceCategoryModule,
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

  afterAll(async () => {
    await app.close();
  });

  describe('- Validate user before creating NCE category', () => {
    it('It Should Authenticate user Before Creating NCE category', async () => {
      const { status } = await supertest
        .agent(app.getHttpServer())
        .post('/nce-category')
        .send({})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(status).toEqual(401);
    });
  });

  it('Should validate NCE Category create request', async () => {
    const { body, status } = await supertest
      .agent(app.getHttpServer())
      .post('/nce-category')
      .set('Authorization', `Bearer ${access_token}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);
    expect(status).toEqual(400);
    expect(body.message).toEqual([
      'Note Category name must be a string',
      'Note Category name is required',
      'is_active must be a boolean value',
      'Is active is required',
    ]);
  });

  it('Should create a NCE category', async () => {
    const noteData: any = {
      name: 'Test',
      description: 'Testing',
      is_active: true,
    };

    const { body, status } = await supertest
      .agent(app.getHttpServer())
      .post('/nce-category')
      .send(noteData)
      .set('Authorization', `Bearer ${access_token}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(status).toEqual(201);
    category_id = body.data.savedNoteCategory.id;
    expect(body.data.savedNoteCategory.name).toEqual(noteData.name);
    expect(body.data.savedNoteCategory.description).toEqual(
      noteData.description
    );
  });

  describe('- Retrieve NCE Categories', () => {
    it('Should return an array of NCE Category', async () => {
      const { body } = await supertest
        .agent(app.getHttpServer())
        .get('/nce-category')
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
        .get(`/nce-category/${category_id}`)
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
        .put(`/nce-category/${category_id}`)
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
        .patch(`/nce-category/${category_id}`)
        .set('Authorization', `Bearer ${access_token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(body.data.is_archived).toEqual(true);
    });
  });
});
