import { NoteCategoryModule } from '../../note-category/note-category.module';
import { NoteSubCategoryModule } from '../note-subcategory.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { testingModuleConfigs } from '../../../../../../../../test/utils';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { TenantModule } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/tenant.module';
import { Repository } from 'typeorm';
import { Category } from 'src/api/system-configuration/tenants-administration/crm-administration/common/entity/category.entity';
import { typeEnum } from 'src/api/system-configuration/tenants-administration/crm-administration/common/enums/type.enum';

describe.skip('Note Sub category', () => {
  let app: INestApplication;
  let tenantRepository: any;
  let userRepository: any;
  let noteCategoryRepository: Repository<Category>;
  let loggedInUser: any;
  let tenant: any;
  let jwtService: any;
  let access_token: any;
  let note: any;
  let note_sub_id: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        NoteCategoryModule,
        NoteSubCategoryModule,
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
      type: typeEnum?.OPERATION_NOTES_ATTACHMENTS_NOTES,
      is_active: true,
      created_by: loggedInUser,
      tenant: tenant,
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
        .post('/note-attachment/note-subcategory')
        .send({})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(status).toEqual(401);
    });
  });

  it('Should validate Note Sub Category create request', async () => {
    const { body, status } = await supertest
      .agent(app.getHttpServer())
      .post('/note-attachment/note-subcategory')
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

  it('Should create a note sub category', async () => {
    const noteData: any = {
      name: 'Test Sub Category',
      description: 'Testing Description',
      is_active: true,
      parent_id: parseInt(note.id),
    };

    const { body, status, ...other } = await supertest
      .agent(app.getHttpServer())
      .post('/note-attachment/note-subcategory')
      .send(noteData)
      .set('Authorization', `Bearer ${access_token}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(status).toEqual(201);
    note_sub_id = body.data.savednotecategory.id;
    expect(body.data.savednotecategory.name).toEqual(noteData.name);
    expect(body.data.savednotecategory.description).toEqual(
      noteData.description
    );
  });

  describe('- Retrieve Sub Notes', () => {
    it('Should return an array of Note Sub Category', async () => {
      const { body } = await supertest
        .agent(app.getHttpServer())
        .get('/note-attachment/note-subcategory')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${access_token}`)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(Array.isArray(body.data.data)).toBe(true);
      expect(body.data.data).toHaveLength(1);
      expect(body.data.data[0].name).toEqual('Test Sub Category');
      expect(body.data.data[0].description).toEqual('Testing Description');
    });
  });

  describe('- Retrieve Sub Note By Id', () => {
    it('Should return a specific Note Category', async () => {
      const { body } = await supertest
        .agent(app.getHttpServer())
        .get(`/note-attachment/note-subcategory/${note_sub_id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${access_token}`)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(body.data.name).toEqual('Test Sub Category');
      expect(body.data.description).toEqual('Testing Description');
    });
  });

  describe('- update note sub category', () => {
    it('Should Update a note Category', async () => {
      const noteData: any = {
        name: 'Test updated',
        description: 'testing updated',
        parent_id: parseInt(note.id),
      };
      const { body, status } = await supertest
        .agent(app.getHttpServer())
        .put(`/note-attachment/note-subcategory/${note_sub_id}`)
        .send(noteData)
        .set('Authorization', `Bearer ${access_token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(status).toEqual(200);
      expect(body.data.name).toEqual(noteData.name);
      expect(body.data.description).toEqual(noteData.description);
    });
  });

  describe('- Archive note Sub Category', () => {
    it('Should archive an note sub Category', async () => {
      const { body, status } = await supertest
        .agent(app.getHttpServer())
        .patch(`/note-attachment/note-subcategory/${note_sub_id}`)
        .set('Authorization', `Bearer ${access_token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(body.data.is_archived).toEqual(true);
    });
  });
});
