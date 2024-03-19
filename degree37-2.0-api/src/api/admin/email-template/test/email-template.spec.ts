import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EmailTemplateController } from '../controller/email-template.controller';
import { CreateEmailTemplateDto } from '../dto/create-email-template.dto';
import { UpdateEmailTemplateDto } from '../dto/update-email-template.dto';
import { templateType } from '../enums/template-type.enum';
import { EmailTemplateService } from '../services/email-template.service';

describe('EmailTemplateController', () => {
  let controller: EmailTemplateController;
  let service: EmailTemplateService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailTemplateController],
      providers: [
        {
          provide: EmailTemplateService,
          useValue: {
            addEmailTemplate: jest.fn(),
            getAllEmailTemplates: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EmailTemplateController>(EmailTemplateController);
    service = module.get<EmailTemplateService>(EmailTemplateService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addEmailTemplate', () => {
    const emailTemplateData: CreateEmailTemplateDto = {
      templateId: BigInt(2),
      templateType: templateType.admin,
      subject: 'Test Email',
      content: 'This is a test email',
      isActive: true,
    };

    const createdEmailTemplate = {
      status: 201,
      message: 'Email Template Created Successfully',
    };

    it('should create a new Email Template', async () => {
      jest
        .spyOn(service, 'addEmailTemplate')
        .mockResolvedValue(createdEmailTemplate);

      const result = await controller.create(emailTemplateData);
      expect(result).toEqual(createdEmailTemplate);
      expect(service.addEmailTemplate).toHaveBeenCalledWith(emailTemplateData);
    });
  });

  describe('listOfEmailTemplates', () => {
    const templateId = BigInt(123);
    const templateSearch = {
      page: 1,
    };
    const templates = {
      id: templateId,
      subject: 'test',
      content: 'test',
      template_type: templateType.admin,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      template: {
        id: BigInt(2),
        title: 'test template',
        slug: 'TEST_TEMPLATE',
        variables: null,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
    };

    it('should get all email templates', async () => {
      jest.spyOn(service, 'getAllEmailTemplates').mockResolvedValue(templates);
      const result = await controller.findAll(templateSearch);
      expect(result).toEqual(templates);
      expect(service.getAllEmailTemplates).toHaveBeenCalledWith(templateSearch);
    });
  });

  describe('GetSingleEmailTemplate', () => {
    const id = BigInt(1);
    const input = {
      id: id,
    };

    const Emailtemplate = {
      id: id,
      subject: 'test',
      content: 'test',
      template_type: templateType.admin,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      template: {
        id: BigInt(2),
        title: 'test template',
        slug: 'TEST_TEMPLATE',
        variables: null,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
    };

    it('should get a single email template', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(Emailtemplate);

      const result = await controller.findOne(input);
      expect(result).toEqual(Emailtemplate);
      expect(service.findOne).toHaveBeenCalledWith(input);
    });
  });

  describe('UpdateEmailTemplate', () => {
    const emailTemplateId = BigInt(123);
    const emailTemplateData: UpdateEmailTemplateDto = {
      templateId: BigInt(2),
      templateType: templateType.admin,
      subject: 'Test Email',
      content: 'This is a test email',
      isActive: true,
    };

    const updatedEmailTemplate = {
      status: HttpStatus.OK,
      message: 'Email Template Updated Succesfuly',
    };

    it('should update a email template', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(updatedEmailTemplate);

      const result = await controller.update(
        emailTemplateId,
        emailTemplateData
      );
      expect(result).toEqual(updatedEmailTemplate);
      expect(service.update).toHaveBeenCalledWith(
        emailTemplateId,
        emailTemplateData
      );
    });
  });

  describe('delete email template', () => {
    const emailTemplateId = BigInt(123);

    const deletedEmailTemplate = {
      status: HttpStatus.OK,
      message: 'Email Template Deleted Succesfuly',
    };

    it('should delete an email template by id', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(deletedEmailTemplate);
      const result = await controller.deleteEmailTemplate(emailTemplateId);
      expect(result).toEqual(deletedEmailTemplate);
      expect(service.remove).toHaveBeenCalledWith(emailTemplateId);
    });
  });
});
