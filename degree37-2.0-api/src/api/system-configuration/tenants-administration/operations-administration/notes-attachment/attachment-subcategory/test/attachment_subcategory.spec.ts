import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { NotesAttachmentSubCategoryModule } from '../attachment-subcategory.module';
import { Category } from '../../../../crm-administration/common/entity/category.entity';
import { testingModuleConfigs } from '../../../../../../../../test/utils';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { TenantModule } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/tenant.module';
import { typeEnum } from '../../../../crm-administration/common/enums/type.enum';

describe.skip('Attachment category', () => {
  let app: INestApplication;
  let tenantRepository: any;
  let userRepository: any;
  let attachmentCategoryRepository: Repository<Category>;
  let loggedInUser: any;
  let tenant: any;
  let jwtService: any;
  let access_token: any;
  let category: any;
  let note_id: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        NotesAttachmentSubCategoryModule,
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
    attachmentCategoryRepository = module.get<Repository<Category>>(
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

    category = await attachmentCategoryRepository.save({
      name: 'Test',
      description: 'Test',
      type: typeEnum?.OPERATION_NOTES_ATTACHMENTS_ATTACHMENTS_CATEGORY,
      is_active: true,
      created_by: loggedInUser,
      tenant: tenant,
    });

    await app.init();
  });

  describe('- Create Account', () => {
    it('It Should Authenticate user Before Creating Note category', async () => {
      const { status, body } = await supertest
        .agent(app.getHttpServer())
        .post('/notes-attachments/attachment-subcategories/')
        .send({})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(status).toEqual(401);
    });
  });

  it('Should validate Attachment Sub Category create request', async () => {
    const { body, status } = await supertest
      .agent(app.getHttpServer())
      .post('/notes-attachments/attachment-subcategories')
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

  it('Should create a attachment sub category', async () => {
    const noteData: any = {
      name: 'Test',
      description: 'Testing',
      is_active: true,
      parent_id: parseInt(category.id),
    };

    const { body, status } = await supertest
      .agent(app.getHttpServer())
      .post('/notes-attachments/attachment-subcategories')
      .send(noteData)
      .set('Authorization', `Bearer ${access_token}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);
    expect(status).toEqual(201);
    note_id = body.data.savedattachmentcategory.id;
    expect(body.data.savedattachmentcategory.name).toEqual(noteData.name);
    expect(body.data.savedattachmentcategory.description).toEqual(
      noteData.description
    );
  });

  describe('- Retrieve Attachment Sub Categories', () => {
    it('Should return an array of Attachement sub Category', async () => {
      const { body } = await supertest
        .agent(app.getHttpServer())
        .get('/notes-attachments/attachment-subcategories')
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

  describe('- Retrieve Attachment subcategory', () => {
    it('Should return a specific attachment sub Category', async () => {
      const { body } = await supertest
        .agent(app.getHttpServer())
        .get(`/notes-attachments/attachment-subcategories/${note_id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${access_token}`)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(body.data.name).toEqual('Test');
      expect(body.data.description).toEqual('Testing');
    });
  });

  describe('- update Attachment Sub category', () => {
    it('Should Update a Attachment Sub Category', async () => {
      const noteData: any = {
        name: 'Test updated',
        description: 'testing updated',
      };
      const { body, status } = await supertest
        .agent(app.getHttpServer())
        .put(`/notes-attachments/attachment-subcategories/${note_id}`)
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
        .patch(`/notes-attachments/attachment-subcategories/${note_id}`)
        .set('Authorization', `Bearer ${access_token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

      expect(body.status_code).toEqual(204);
      expect(body.data.is_archived).toEqual(true);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
