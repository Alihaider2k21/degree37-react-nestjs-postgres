import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { NoteCategoryModule } from '../note-category.module';
import { testingModuleConfigs } from '../../../../../../../../test/utils';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { TenantModule } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/tenant.module';

describe.skip('Note category', () => {
  let app: INestApplication;
  let tenantRepository: any;
  let userRepository: any;
  let loggedInUser: any;
  let tenant: any;
  let jwtService: any;
  let access_token: any;
  let note_id: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        NoteCategoryModule,
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

  describe('- Create Account', () => {
    it('It Should Authenticate user Before Creating Note category', async () => {
      const { status } = await supertest
        .agent(app.getHttpServer())
        .post('/note-attachment/note-category')
        .send({})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(status).toEqual(401);
    });
  });

  it('Should validate note Category create request', async () => {
    const { body, status } = await supertest
      .agent(app.getHttpServer())
      .post('/note-attachment/note-category')
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

  it('Should create a note category', async () => {
    const noteData: any = {
      name: 'Test',
      description: 'Testing',
      is_active: true,
    };

    const { body, status } = await supertest
      .agent(app.getHttpServer())
      .post('/note-attachment/note-category')
      .send(noteData)
      .set('Authorization', `Bearer ${access_token}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(status).toEqual(201);
    note_id = body.data.savedNoteCategory.id;
    expect(body.data.savedNoteCategory.name).toEqual(noteData.name);
    expect(body.data.savedNoteCategory.description).toEqual(
      noteData.description
    );
  });

  describe('- Retrieve Notes', () => {
    it('Should return an array of Note Category', async () => {
      const { body } = await supertest
        .agent(app.getHttpServer())
        .get('/note-attachment/note-category')
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

  describe('- Retrieve Note', () => {
    it('Should return a specific Note Category', async () => {
      const { body } = await supertest
        .agent(app.getHttpServer())
        .get(`/note-attachment/note-category/${note_id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${access_token}`)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(body.data.name).toEqual('Test');
      expect(body.data.description).toEqual('Testing');
    });
  });

  describe('- update note category', () => {
    it('Should Update a note Category', async () => {
      const noteData: any = {
        name: 'Test updated',
        description: 'testing updated',
      };
      const { body, status } = await supertest
        .agent(app.getHttpServer())
        .put(`/note-attachment/note-category/${note_id}`)
        .send(noteData)
        .set('Authorization', `Bearer ${access_token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(status).toEqual(200);
      expect(body.data.name).toEqual(noteData.name);
      expect(body.data.description).toEqual(noteData.description);
    });
  });

  describe('- Archive note Category', () => {
    it('Should archive an note Category', async () => {
      const { body, status } = await supertest
        .agent(app.getHttpServer())
        .patch(`/note-attachment/note-category/${note_id}`)
        .set('Authorization', `Bearer ${access_token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(body.data.is_archived).toEqual(true);
    });
  });
});
